import { Injectable, Logger } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { SubscriptionService } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { OrganizationService } from '@hookpost/nestjs-libraries/database/prisma/organizations/organization.service';
import { makeId } from '@hookpost/nestjs-libraries/services/make.is';
import { BillingSubscribeDto } from '@hookpost/nestjs-libraries/dtos/billing/billing.subscribe.dto';
import {
  pricing,
  getPricing,
  getCurrencyConfig,
  CURRENCY_CODE,
  CURRENCY_MINOR_MULTIPLIER,
} from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { UsersService } from '@hookpost/nestjs-libraries/database/prisma/users/users.service';
import { TrackService } from '@hookpost/nestjs-libraries/track/track.service';
import { TrackEnum } from '@hookpost/nestjs-libraries/user/track.enum';
import { RazorpayClient } from '@hookpost/nestjs-libraries/services/razorpay.client';
import {
  scheduledCancelAt,
  LIVE_STATES,
  buildPlanKey,
  parsePlanKey,
} from '@hookpost/nestjs-libraries/services/razorpay.mapping';

type Billing = 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE';
type Period = 'MONTHLY' | 'YEARLY';

/**
 * Number of billing cycles we request per subscription. Razorpay requires a
 * finite total_count, so we ask for the maximum sensible horizon rather than
 * letting it lapse: 10 years monthly, 10 years yearly.
 */
const TOTAL_COUNT: Record<Period, number> = { MONTHLY: 120, YEARLY: 10 };

/** Free-trial length in days, matching what the billing page advertises. */
const TRIAL_DAYS_DEFAULT = 7;

function subscriptionSafeId(payment: any) {
  return payment?.order_id || payment?.invoice_id || String(payment?.created_at || '');
}

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private readonly client = new RazorpayClient();
  /** planId cache, keyed by tier|period|amount so a price change forces a new plan. */
  private planCache = new Map<string, string>();
  /** Reverse map: planId -> the tier/period it represents. */
  private planTierCache = new Map<string, { billing: Billing; period: Period }>();

  constructor(
    private _subscriptionService: SubscriptionService,
    private _organizationService: OrganizationService,
    private _userService: UsersService,
    private _trackService: TrackService
  ) {}

  // ---------------------------------------------------------------------------
  // Webhooks
  // ---------------------------------------------------------------------------

  /**
   * Signature-check an inbound webhook and return the parsed event.
   * Mirrors StripeService.validateRequest so the controller shape is unchanged.
   */
  validateRequest(rawBody: Buffer, signature: string, endpointSecret: string) {
    this.client.verifyWebhook(rawBody, signature, endpointSecret);
    return JSON.parse(rawBody.toString('utf8'));
  }

  /**
   * Razorpay delivers one webhook endpoint for every event, so we branch here
   * rather than in the controller. Returns {ok:true} for events we ignore, so
   * Razorpay does not retry them.
   */
  async handleWebhook(event: any) {
    const type: string = event?.event || '';
    const subscription = event?.payload?.subscription?.entity;
    const payment = event?.payload?.payment?.entity;

    switch (type) {
      case 'subscription.authenticated':
      case 'subscription.activated':
      case 'subscription.charged':
        return this.createSubscription(subscription, payment);
      case 'subscription.updated':
        return this.updateSubscription(subscription);
      case 'subscription.cancelled':
      case 'subscription.completed':
      case 'subscription.expired':
        return this.deleteSubscription(subscription);
      case 'subscription.halted':
      case 'subscription.pending':
        // Payment is failing but the subscription is not dead yet. Leave
        // entitlements intact; Razorpay will either recover or cancel it.
        this.logger.warn(
          `Subscription ${subscription?.id} is ${type} - payment retry in progress.`
        );
        return { ok: true };
      default:
        return { ok: true };
    }
  }

  /** A subscription became live (first activation, or a renewal charge). */
  async createSubscription(subscription: any, payment?: any) {
    if (!subscription?.id) return { ok: true };

    const notes = subscription.notes || {};
    const orgId: string | undefined = notes.orgId;

    // Our own checkout stamps notes.service, so this doubles as proof the
    // subscription is ours. It gates the notes fallback below: on a Razorpay
    // account shared with another product, a foreign plan could carry a
    // notes.billing that happens to spell one of our tier names, and trusting
    // it would hand that customer a Hookpost plan they never bought.
    const isOurs = notes.service === 'hookpost';

    // The plan is authoritative; notes can be stale after a plan change.
    const fromPlan = await this.resolveTierFromPlan(subscription.plan_id);
    const billing = (fromPlan?.billing ||
      (isOurs ? (notes.billing || '').toUpperCase() : '')) as Billing;
    const period = (fromPlan?.period ||
      (notes.period || 'MONTHLY').toUpperCase()) as Period;

    if (!pricing[billing]) {
      this.logger.warn(
        `Ignoring subscription ${subscription.id}: could not resolve tier ` +
          `(plan_id=${subscription.plan_id}, notes.billing=${notes.billing}).`
      );
      return { ok: true };
    }

    const customerId = subscription.customer_id;

    await this._subscriptionService.createOrUpdateSubscription(
      subscription.status === 'authenticated', // treated as trialing
      subscription.id,
      customerId,
      pricing[billing].channel!,
      billing,
      period,
      scheduledCancelAt(subscription),
      undefined,
      orgId
    );

    if (orgId) {
      // Report the revenue conversion. TrackService was injected here but never
      // called, so Purchase - the only event that says an ad actually produced
      // money - never fired at all. Without it, ad platforms optimise towards
      // signups and cannot tell a paying customer from a tyre-kicker.
      //
      // Fired server-side from the webhook on purpose: it survives ad blockers
      // and closed tabs, and it is the only place the real charged amount is
      // known. Only on an actual charge - `authenticated` and `activated` carry
      // no money.
      await this.trackPurchase(orgId, payment);

      // Keep Organization.paymentId aligned with the Razorpay customer.
      await this._subscriptionService.updateCustomerId(orgId, customerId);
      this.sendSubscriptionWelcomeEmail(
        orgId,
        billing,
        period,
        subscription.status === 'authenticated'
      ).catch((e) => {
        this.logger.error(`Failed to send subscription welcome email: ${e}`);
      });
    }

    return { ok: true };
  }

  /**
   * Report a completed payment to the ads pixel, server-side.
   *
   * Never throws: a tracking outage must not fail a webhook Razorpay will
   * otherwise retry, which would double-provision the subscription.
   */
  private async trackPurchase(orgId: string, payment?: any) {
    try {
      if (!payment?.amount) return;

      const team = await this._organizationService.getTeam(orgId);
      const user = team?.users?.[0]?.user;

      await this._trackService.track(
        // Deterministic per payment, so a Razorpay webhook retry reports the
        // same event id and Meta collapses it rather than counting twice.
        `purchase_${payment.id || subscriptionSafeId(payment)}`,
        // No client IP or user-agent here on purpose. This runs in a Razorpay
        // webhook, so the only address available is Razorpay's server - sending
        // that would attach the wrong signal to the conversion. The hashed
        // email below is the match key that matters for a purchase.
        '',
        '',
        TrackEnum.Purchase,
        {
          // Razorpay amounts are in the minor unit (paise), the pixel wants
          // the major unit.
          value: payment.amount / 100,
          currency: payment.currency || 'INR',
        },
        undefined,
        user as any
      );
    } catch (e) {
      this.logger.error(`Purchase tracking failed for org ${orgId}: ${e}`);
    }
  }

  async sendSubscriptionWelcomeEmail(
    orgId: string,
    billing: Billing,
    period: Period,
    isTrial: boolean
  ) {
    try {
      const apiKey = process.env.RESEND_API_KEY || '';
      if (!apiKey) return;

      const team = await this._organizationService.getTeam(orgId);
      const user = team?.users?.[0]?.user;
      const email = user?.email;
      const org = await this._organizationService.getOrgById(orgId);
      const orgName = org?.name || 'Your Team';

      if (!email || !email.includes('@')) return;

      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);

      const planName = `${billing.charAt(0) + billing.slice(1).toLowerCase()} Plan`;
      const channels = pricing[billing]?.channel || 10;
      const subject = isTrial
        ? `🎉 Welcome to Hookpost ${billing.charAt(0) + billing.slice(1).toLowerCase()} (7-Day Trial Active)`
        : `🎉 Welcome to Hookpost ${billing.charAt(0) + billing.slice(1).toLowerCase()}!`;

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0b0d13; color: #ffffff; border-radius: 16px; border: 1px solid #1f2430;">
          <div style="text-align: center; margin-bottom: 28px;">
            <img src="https://hookpost.hookstep.in/brand-logo.png" alt="Hookpost" style="height: 48px; width: auto; max-height: 48px; margin-bottom: 16px;" />
            <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Welcome to Hookpost</h1>
            <p style="color: #94a3b8; font-size: 15px; margin-top: 8px;">${isTrial ? 'Your 7-Day Free Trial is now active!' : 'Your subscription is now live!'}</p>
          </div>

          <div style="background-color: #131722; border: 1px solid #232a3b; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <h2 style="color: #FF4CE2; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Subscription Overview</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
              <tr>
                <td style="padding: 9px 0; color: #94a3b8; border-bottom: 1px solid #1e2536;">Organization</td>
                <td style="padding: 9px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #1e2536;">${orgName}</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; color: #94a3b8; border-bottom: 1px solid #1e2536;">Plan Tier</td>
                <td style="padding: 9px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #1e2536;">${planName} (${channels} Channels)</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; color: #94a3b8; border-bottom: 1px solid #1e2536;">Billing Cycle</td>
                <td style="padding: 9px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #1e2536;">${period === 'MONTHLY' ? 'Monthly' : 'Yearly'}</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; color: #94a3b8;">Status</td>
                <td style="padding: 9px 0; font-weight: 600; text-align: right; color: #10b981;">● Active</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 32px; text-align: center;">
            <p style="color: #cbd5e1; font-size: 15px; font-weight: 600; margin-bottom: 16px;">Quick Start Actions:</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <a href="https://hookpost.hookstep.in/launches" style="display: block; background: #FF4CE2; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-bottom: 10px; text-align: center;">
                🔗 Connect Your Social Channels →
              </a>
              <a href="https://play.google.com/store/apps/details?id=in.hookstep.hookpost.twa" style="display: block; background: #1e293b; color: #38bdf8; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; border: 1px solid #334155; margin-bottom: 10px; text-align: center;">
                📱 Download Hookpost on Google Play
              </a>
              <a href="https://hookpost.hookstep.in/launches" style="display: block; background: #131722; color: #cbd5e1; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; border: 1px solid #232a3b; text-align: center;">
                📅 Schedule Your First Post
              </a>
            </div>
          </div>

          <div style="background-color: #0f121a; border-left: 4px solid #FF4CE2; padding: 16px 20px; border-radius: 8px; margin-bottom: 28px;">
            <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6; margin: 0 0 10px 0;">
              <em>"Need help connecting an account or migrating your schedule from Buffer or Hootsuite? Simply hit reply to this email — my team and I personally read and respond to every message."</em>
            </p>
            <p style="font-size: 13px; color: #94a3b8; margin: 0; font-weight: 600;">
              — Mohan Bhanushali<br/>
              <span style="font-weight: 400; font-size: 12px; color: #64748b;">Founder, Hookpost & JR Consulting Co.</span>
            </p>
          </div>

          <div style="text-align: center; border-top: 1px solid #1e2430; padding-top: 20px; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 6px 0;">Hookpost by HookStep &bull; JR Consulting Co.</p>
            <p style="margin: 0;">
              <a href="https://hookpost.hookstep.in/privacy" style="color: #94a3b8; text-decoration: underline;">Privacy Policy</a> &bull;
              <a href="https://hookpost.hookstep.in/terms" style="color: #94a3b8; text-decoration: underline;">Terms of Service</a> &bull;
              <a href="mailto:support@hookstep.in" style="color: #94a3b8; text-decoration: underline;">support@hookstep.in</a>
            </p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: 'Hookpost Support <support@hookstep.in>',
        to: email,
        reply_to: 'support@hookstep.in',
        subject,
        html,
      });

      this.logger.log(
        `Subscription welcome email sent to ${email} for org ${orgId}`
      );
    } catch (err) {
      this.logger.error(`Error sending subscription welcome email: ${err}`);
    }
  }

  /**
   * Directly fetch subscription details from Razorpay and provision entitlements.
   * Useful when verifying subscription payment immediately from checkout callback.
   */
  async syncSubscriptionById(subscriptionId: string) {
    if (!subscriptionId) return { ok: false };
    try {
      const subscription = await this.client.request(
        'GET',
        `/subscriptions/${subscriptionId}`
      );
      if (subscription?.id) {
        await this.createSubscription(subscription);
        return { ok: true, subscription };
      }
    } catch (e) {
      this.logger.error(`syncSubscriptionById failed for ${subscriptionId}: ${e}`);
    }
    return { ok: false };
  }

  async updateSubscription(subscription: any) {
    // Razorpay sends the full entity on update, so activation and update
    // converge on the same reconciliation path.
    return this.createSubscription(subscription);
  }

  /**
   * Cancel/complete/expire. This must positively identify the subscription as
   * ours before touching anything.
   *
   * Razorpay customers are account-level, and one Razorpay account can serve
   * several products, each with its own webhook subscribed to the same events.
   * So a cancellation raised by a *different* product is delivered here too,
   * carrying a customer_id that may well match a paying Hookpost organization.
   * Keying the downgrade off customer_id alone would strip that organization's
   * plan because of an event that had nothing to do with Hookpost.
   *
   * The subscription id is the thing that is unambiguously ours or not: we
   * store it as Subscription.identifier when the plan is created. No stored
   * row, no action - and the downgrade is then scoped to the organization that
   * actually owns that row rather than to every org sharing the customer.
   */
  async deleteSubscription(subscription: any) {
    if (!subscription?.id) return { ok: true };

    const known = await this._subscriptionService.getSubscriptionByIdentifier(
      subscription.id
    );

    if (!known) {
      this.logger.warn(
        `Ignoring ${subscription.id}: no Hookpost subscription with that ` +
          `identifier (customer ${subscription.customer_id}). Likely another ` +
          `product on the same Razorpay account.`
      );
      return { ok: true };
    }

    await this._subscriptionService.deleteSubscriptionByOrg(
      known.organizationId
    );
    return { ok: true };
  }

  /**
   * Kept for parity with the Stripe controller's invoice.payment_succeeded
   * branch; Razorpay covers this with subscription.charged.
   */
  async paymentSucceeded(event: any) {
    const subscription = event?.payload?.subscription?.entity;
    if (!subscription) return { ok: true };
    return this.createSubscription(subscription);
  }

  // ---------------------------------------------------------------------------
  // Customers, plans
  // ---------------------------------------------------------------------------

  async createOrGetCustomer(organization: Organization): Promise<string> {
    if (organization.paymentId) {
      return organization.paymentId;
    }
    // Mirror upstream: the billing contact is the first member of the team.
    const team = await this._organizationService.getTeam(organization.id);
    const rawEmail = team?.users?.[0]?.user?.email || '';
    // Razorpay rejects malformed emails, and self-hosted installs allow
    // username-only logins, so synthesise a domain when one is missing.
    const email =
      rawEmail.indexOf('@') > -1
        ? rawEmail
        : `${rawEmail || organization.id}@${
            process.env.BILLING_EMAIL_DOMAIN || 'hookpost.local'
          }`;

    try {
      const created = await this.client.request('POST', '/customers', {
        name: organization.name || 'Hookpost customer',
        email,
        // Do not error if a customer with this email already exists -- return it.
        fail_existing: 0,
        notes: { orgId: organization.id },
      });

      await this._subscriptionService.updateCustomerId(
        organization.id,
        created.id
      );
      return created.id;
    } catch (err: any) {
      if (
        err?.message?.includes('Customer already exists') ||
        err?.message?.includes('already exists')
      ) {
        const list = await this.client.request<{
          items: Array<{ id: string; email: string }>;
        }>('GET', `/customers?count=100`);
        const existing = list?.items?.find(
          (c) => c.email && c.email.toLowerCase() === email.toLowerCase()
        );
        if (existing?.id) {
          await this._subscriptionService.updateCustomerId(
            organization.id,
            existing.id
          );
          return existing.id;
        }
      }
      throw err;
    }
  }

  async getCustomerByOrganizationId(organizationId: string) {
    const org = await this._organizationService.getOrgById(organizationId);
    return org?.paymentId || '';
  }

  private amountFor(billing: Billing, period: Period, currency: string = CURRENCY_CODE) {
    const curr = (currency || CURRENCY_CODE).toUpperCase();
    const planPricing = getPricing(curr);
    const p = planPricing[billing] || pricing[billing];
    const major = period === 'MONTHLY' ? p.month_price : p.year_price;
    const mult = getCurrencyConfig(curr).minorMultiplier || CURRENCY_MINOR_MULTIPLIER;
    return major * mult;
  }

  /**
   * Razorpay plans are immutable once created, so we key on the exact amount.
   * Changing a price in pricing.ts therefore provisions a new plan rather than
   * silently repricing existing subscribers.
   */
  private async findOrCreatePlan(
    billing: Billing,
    period: Period,
    currency: string = CURRENCY_CODE
  ) {
    const curr = (currency || CURRENCY_CODE).toUpperCase();
    const amount = this.amountFor(billing, period, curr);
    const key = buildPlanKey(billing, period, amount, curr);
    const cached = this.planCache.get(key);
    if (cached) return cached;

    // Page through every plan. Razorpay caps `count` at 100, and this account
    // may be shared with another product, so our plan can easily sit past the
    // first page. Stopping at page one would silently miss it and create a
    // duplicate plan on every single subscribe.
    const match = await this.findPlanByKey(key);
    if (match) {
      this.planCache.set(key, match);
      return match;
    }

    const created = await this.client.request('POST', '/plans', {
      period: period === 'MONTHLY' ? 'monthly' : 'yearly',
      interval: 1,
      item: {
        name: `Hookpost ${billing} ${period} (${curr})`,
        amount,
        currency: curr,
      },
      notes: { hookpost_key: key, billing, period },
    });
    this.planCache.set(key, created.id);
    return created.id;
  }

  /**
   * Resolve which tier/period a Razorpay plan represents.
   *
   * This is the authoritative source when reconciling a webhook, and it must be
   * preferred over the subscription's own `notes`. On an upgrade we PATCH the
   * subscription's plan_id, but Razorpay keeps the notes that were set when the
   * subscription was created -- so trusting notes.billing would write the OLD
   * tier back to the database and under-entitle a customer who just paid more.
   *
   * Plans are created by findOrCreatePlan with notes.hookpost_key of the form
   * "TIER|PERIOD|amount|currency", which we parse back out here.
   */
  private async resolveTierFromPlan(
    planId?: string
  ): Promise<{ billing: Billing; period: Period } | null> {
    if (!planId) return null;

    const cached = this.planTierCache.get(planId);
    if (cached) return cached;

    const plan = await this.client
      .request('GET', `/plans/${planId}`)
      .catch(() => null);
    if (!plan) return null;

    // hookpost_key is written by createPlan for every plan we own, so its
    // absence means the plan belongs to another product on this account.
    // Falling back to plan.notes.billing here would let a foreign plan named
    // after one of our tiers resolve as ours.
    const parsed = parsePlanKey(plan?.notes?.hookpost_key);
    if (!parsed) return null;

    const billing = (parsed.billing || '').toUpperCase();
    const resolvedPeriod = (
      parsed.period ||
      plan?.notes?.period ||
      (plan?.period === 'yearly' ? 'YEARLY' : 'MONTHLY')
    ).toUpperCase();

    if (!pricing[billing]) return null;

    const result = {
      billing: billing as Billing,
      period: resolvedPeriod as Period,
    };
    this.planTierCache.set(planId, result);
    return result;
  }

  /**
   * Find a plan by its hookpost_key, paging through the full list.
   *
   * Razorpay's /plans endpoint caps `count` at 100 and paginates with `skip`.
   * The cap is why this loops: on an account shared with another product our
   * plan may not be on the first page.
   */
  private async findPlanByKey(key: string): Promise<string | null> {
    const PAGE = 100;
    // Safety valve so a pathological account cannot spin forever.
    const MAX_PAGES = 50;

    for (let page = 0; page < MAX_PAGES; page++) {
      const skip = page * PAGE;
      const res = await this.client
        .request('GET', `/plans?count=${PAGE}&skip=${skip}`)
        .catch(() => null);
      const items: any[] = res?.items || [];

      const hit = items.find((plan: any) => plan?.notes?.hookpost_key === key);
      if (hit) return hit.id;

      // A short page means we have seen everything.
      if (items.length < PAGE) return null;
    }

    this.logger.warn(
      `Gave up scanning plans after ${MAX_PAGES * PAGE}; a duplicate plan may be created.`
    );
    return null;
  }

  // ---------------------------------------------------------------------------
  // Subscribe / change plan
  // ---------------------------------------------------------------------------

  /**
   * Create a new subscription, or move an existing one to a different plan.
   *
   * Returns either { url } for a fresh subscription (the caller redirects the
   * customer to Razorpay's hosted checkout to authorise the mandate) or { id }
   * when an existing mandate was rebound to a new plan without re-auth.
   */
  async subscribe(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ) {
    const id = makeId(10);
    const billing = body.billing.toUpperCase() as Billing;
    const period = (body.period || 'MONTHLY').toUpperCase() as Period;
    const currency = (body.currency || CURRENCY_CODE).toUpperCase();

    const org = (await this._organizationService.getOrgById(organizationId))!;
    const customerId = await this.createOrGetCustomer(org);
    const planId = await this.findOrCreatePlan(billing, period, currency);

    const current = await this._subscriptionService.getSubscription(
      organizationId
    );

    // Existing mandate -> switch plans in place, no new authorisation needed.
    if (current?.identifier) {
      try {
        await this.client.request(
          'PATCH',
          `/subscriptions/${current.identifier}`,
          {
            plan_id: planId,
            quantity: 1,
            // Upgrades take effect immediately; Razorpay raises a prorated
            // charge for the remainder of the current cycle.
            schedule_change_at: 'now',
            customer_notify: 1,
            // Best effort: keep notes consistent with the new plan. Webhook
            // reconciliation does not depend on this succeeding -- it reads the
            // plan -- but stale notes are confusing in the dashboard.
            notes: {
              service: 'hookpost',
              billing,
              period,
              currency,
              orgId: organizationId,
              userId,
              id,
            },
          }
        );
        return { id };
      } catch (err) {
        this.logger.error(
          `In-place plan change failed for ${current.identifier}: ${err}`
        );
        // Fall through and issue a fresh mandate instead of failing the request.
      }
    }

    // The billing UI advertises "Pay NOTHING for the first 7 days", and
    // org.allowTrial decides eligibility. Requiring RAZORPAY_TRIAL_DAYS to be
    // set as well meant an unset variable silently charged trial-eligible
    // customers immediately, contradicting the page they just agreed to. Default
    // to the advertised 7 days; set RAZORPAY_TRIAL_DAYS=0 to turn trials off
    // (and change the copy if you do).
    const configuredTrial = process.env.RAZORPAY_TRIAL_DAYS;
    const trialDays =
      configuredTrial === undefined || configuredTrial === ''
        ? TRIAL_DAYS_DEFAULT
        : Number(configuredTrial);

    const startAt =
      allowTrial && Number.isFinite(trialDays) && trialDays > 0
        ? Math.floor(Date.now() / 1000) + trialDays * 86400
        : undefined;

    const created = await this.client.request('POST', '/subscriptions', {
      plan_id: planId,
      total_count: TOTAL_COUNT[period],
      quantity: 1,
      customer_notify: 1,
      customer_id: customerId,
      ...(startAt ? { start_at: startAt } : {}),
      ...(process.env.RAZORPAY_OFFER_ID
        ? { offer_id: process.env.RAZORPAY_OFFER_ID }
        : {}),
      notes: {
        service: 'hookpost',
        billing,
        period,
        currency,
        orgId: organizationId,
        userId,
        id,
        ud: uniqueId,
      },
    });

    return { id, url: created.short_url, subscriptionId: created.id };
  }

  /**
   * Razorpay has no hosted billing portal. Point the customer at our own
   * billing screen instead, so the caller's { url } contract still holds.
   */
  async createBillingPortalLink(_customer: string) {
    const base =
      process.env.FRONTEND_URL || process.env.MAIN_URL || 'http://localhost:4200';
    return { url: `${base}/billing` };
  }

  // ---------------------------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------------------------

  async getCustomerSubscriptions(organizationId: string) {
    const customerId = await this.getCustomerByOrganizationId(organizationId);
    if (!customerId) return { items: [], count: 0 };
    return this.client.request(
      'GET',
      `/subscriptions?customer_id=${encodeURIComponent(customerId)}&count=100`
    );
  }

  private async liveSubscriptionFor(organizationId: string) {
    const local = await this._subscriptionService.getSubscription(
      organizationId
    );
    if (local?.identifier) {
      const remote = await this.client
        .request('GET', `/subscriptions/${local.identifier}`)
        .catch(() => null);
      if (remote && LIVE_STATES.includes(remote.status)) return remote;
    }
    const all = await this.getCustomerSubscriptions(organizationId);
    return (all?.items || []).find((s: any) => LIVE_STATES.includes(s.status));
  }

  /** Toggle "cancel at end of period" on and off. */
  async setToCancel(organizationId: string) {
    const id = makeId(10);
    const sub = await this.liveSubscriptionFor(organizationId);
    if (!sub) return { id, cancel_at: undefined };

    // Already scheduled to end -> the user is un-cancelling. Razorpay cannot
    // revoke a scheduled cancellation, so we re-subscribe on the same plan.
    if (sub.end_at && sub.status !== 'cancelled') {
      const resumed = await this.client
        .request('POST', '/subscriptions', {
          plan_id: sub.plan_id,
          total_count: sub.total_count || 120,
          quantity: 1,
          customer_notify: 1,
          customer_id: sub.customer_id,
          start_at: sub.end_at,
          notes: sub.notes,
        })
        .catch((e: any) => {
          this.logger.error(`Failed to resume subscription: ${e}`);
          return null;
        });
      if (resumed) return { id, cancel_at: undefined };
    }

    const cancelled = await this.client.request(
      'POST',
      `/subscriptions/${sub.id}/cancel`,
      { cancel_at_cycle_end: 1 }
    );

    return {
      id,
      cancel_at: cancelled.end_at
        ? new Date(cancelled.end_at * 1000)
        : undefined,
    };
  }

  /** Hard cancel, effective immediately. */
  async cancelSubscription(organizationId: string) {
    const sub = await this.liveSubscriptionFor(organizationId);
    if (!sub) return { ok: true };
    await this.client.request('POST', `/subscriptions/${sub.id}/cancel`, {
      cancel_at_cycle_end: 0,
    });
    await this._subscriptionService.deleteSubscription(sub.customer_id);
    return { ok: true };
  }

  async cancelAllSubscriptions(organizationId: string) {
    const all = await this.getCustomerSubscriptions(organizationId);
    for (const sub of all?.items || []) {
      if (!LIVE_STATES.includes(sub.status)) continue;
      await this.client
        .request('POST', `/subscriptions/${sub.id}/cancel`, {
          cancel_at_cycle_end: 0,
        })
        .catch((e: any) =>
          this.logger.error(`Failed cancelling ${sub.id}: ${e}`)
        );
    }
    const customerId = await this.getCustomerByOrganizationId(organizationId);
    if (customerId) {
      await this._subscriptionService.deleteSubscription(customerId);
    }
    return { ok: true };
  }

  async checkSubscription(organizationId: string, subscriptionId: string) {
    return this._subscriptionService.checkSubscription(
      organizationId,
      subscriptionId
    );
  }

  // ---------------------------------------------------------------------------
  // Invoices, charges, refunds
  // ---------------------------------------------------------------------------

  async getCharges(organizationId: string) {
    const customerId = await this.getCustomerByOrganizationId(organizationId);
    if (!customerId) return [];
    const invoices = await this.client.request(
      'GET',
      `/invoices?customer_id=${encodeURIComponent(customerId)}&count=100`
    );
    return (invoices?.items || []).map((inv: any) => ({
      id: inv.payment_id || inv.id,
      amount: (inv.amount || 0) / CURRENCY_MINOR_MULTIPLIER,
      currency: inv.currency,
      status: inv.status,
      created: inv.issued_at ? new Date(inv.issued_at * 1000) : null,
      invoiceUrl: inv.short_url,
      receipt: inv.receipt,
    }));
  }

  async refundCharges(organizationId: string, chargeIds: string[]) {
    const results: any[] = [];
    for (const paymentId of chargeIds) {
      const refund = await this.client
        .request('POST', `/payments/${paymentId}/refund`, {
          notes: { orgId: organizationId, reason: 'hookpost_admin_refund' },
        })
        .catch((e: any) => {
          this.logger.error(`Refund failed for ${paymentId}: ${e}`);
          return { id: null, error: String(e) };
        });
      results.push(refund);
    }
    return results;
  }

  // ---------------------------------------------------------------------------
  // Proration preview
  // ---------------------------------------------------------------------------

  /**
   * Preview what changing plan costs today.
   *
   * Razorpay has no "preview upcoming invoice" endpoint, so we compute the
   * proration ourselves the same way Razorpay does on an immediate plan change:
   * unused value on the current plan is credited against the new plan's price.
   */
  async prorate(organizationId: string, body: BillingSubscribeDto) {
    const billing = body.billing.toUpperCase() as Billing;
    const period = (body.period || 'MONTHLY').toUpperCase() as Period;
    const currency = (body.currency || CURRENCY_CODE).toUpperCase();
    const mult = getCurrencyConfig(currency).minorMultiplier || CURRENCY_MINOR_MULTIPLIER;
    const target = this.amountFor(billing, period, currency) / mult;

    const sub = await this.liveSubscriptionFor(organizationId);
    if (!sub) return { price: target };

    const now = Math.floor(Date.now() / 1000);
    const start = sub.current_start || now;
    const end = sub.current_end || now;
    const cycle = Math.max(end - start, 1);
    const remaining = Math.max(end - now, 0);

    const local = await this._subscriptionService.getSubscription(
      organizationId
    );
    const currentTier = (local?.subscriptionTier || 'FREE') as Billing;
    const currentPeriod = (local?.period || 'MONTHLY') as Period;
    const planPricing = getPricing(currency);
    const currentAmount =
      (planPricing[currentTier]
        ? this.amountFor(currentTier, currentPeriod, currency)
        : 0) / mult;

    const credit = currentAmount * (remaining / cycle);
    const price = Math.max(target - credit, 0);

    return { price: Math.round(price * 100) / 100 };
  }

  // ---------------------------------------------------------------------------
  // Packages
  // ---------------------------------------------------------------------------

  /**
   * Advertised prices come straight from pricing.ts rather than the payment
   * provider, so the marketing page renders correctly even before any Razorpay
   * plan has been provisioned.
   */
  async getPackages(currency?: string) {
    const curr = (currency || CURRENCY_CODE).toUpperCase();
    const activePricing = getPricing(curr);
    const tiers = Object.values(activePricing).filter((p) => p.month_price > 0);
    return {
      month: tiers.map((p) => ({
        name: p.current,
        recurring: 'month',
        price: p.month_price,
        currency: curr,
      })),
      year: tiers.map((p) => ({
        name: p.current,
        recurring: 'year',
        price: p.year_price,
        currency: curr,
      })),
    };
  }

  // ---------------------------------------------------------------------------
  // Discounts / coupons
  // ---------------------------------------------------------------------------
  //
  // Razorpay Offers cannot be created over the API -- they are defined in the
  // dashboard and referenced by id. So the retention-discount flow is driven by
  // RAZORPAY_OFFER_ID instead of creating a coupon on the fly.

  async checkDiscount(_customer: string) {
    // "Has a discount already been applied?" We have no per-customer coupon
    // state in Razorpay, so report false and let the offer decide at checkout.
    return false;
  }

  async applyDiscount(_customer: string) {
    if (!process.env.RAZORPAY_OFFER_ID) {
      this.logger.warn(
        'applyDiscount called but RAZORPAY_OFFER_ID is unset; no offer applied.'
      );
      return { ok: false, reason: 'no_offer_configured' };
    }
    // The offer is attached on the next subscription create (see subscribe()).
    return { ok: true, offerId: process.env.RAZORPAY_OFFER_ID };
  }

  async getCouponInfo(_organizationId: string) {
    return { coupon: null as string | null, percentOff: 0 };
  }

  async applyCoupon(_organizationId: string, _body: any) {
    return { ok: false, reason: 'coupons_not_supported_on_razorpay' };
  }

  async cancelCoupon(_organizationId: string) {
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // Trial
  // ---------------------------------------------------------------------------

  /**
   * End a trial early by charging the mandate now. Razorpay does not expose a
   * "finish trial" call, so we bring the next charge forward to immediately.
   */
  async finishTrial(paymentId: string) {
    if (!paymentId) return { ok: false };
    const subs = await this.client
      .request(
        'GET',
        `/subscriptions?customer_id=${encodeURIComponent(paymentId)}&count=10`
      )
      .catch(() => null);
    const sub = (subs?.items || []).find((s: any) =>
      LIVE_STATES.includes(s.status)
    );
    if (!sub) return { ok: false };

    await this.client
      .request('PATCH', `/subscriptions/${sub.id}`, {
        start_at: Math.floor(Date.now() / 1000),
        schedule_change_at: 'now',
      })
      .catch((e: any) => this.logger.error(`finishTrial failed: ${e}`));
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // Parity stubs
  // ---------------------------------------------------------------------------

  /**
   * Stripe's embedded Checkout has no Razorpay analogue: Razorpay Checkout is a
   * client-side JS modal keyed on a subscription id. We therefore create the
   * subscription and hand the frontend everything the modal needs.
   */
  async embedded(
    uniqueId: string,
    organizationId: string,
    userId: string,
    body: BillingSubscribeDto,
    allowTrial: boolean
  ) {
    const result = await this.subscribe(
      uniqueId,
      organizationId,
      userId,
      body,
      allowTrial
    );
    const currency = (body.currency || CURRENCY_CODE).toUpperCase();
    return {
      ...result,
      keyId: process.env.RAZORPAY_KEY_ID || '',
      currency,
      providerName: 'razorpay',
    };
  }

  /**
   * Upstream syncs Stripe customer emails when two accounts are merged.
   * Razorpay customers are immutable on email, so this is a no-op we keep for
   * call-site compatibility.
   */
  async syncCustomerEmailsAfterSwitch(_users: any[]) {
    return { ok: true };
  }

  // Chatbase was a Postiz-specific partner integration with its own Stripe
  // Connect refund maths. It has no meaning in Hookpost; these return inert
  // values so the routes stay wired but never move money.
  async chatbaseRefundPreview(_organizationId: string) {
    return {
      amount: 0,
      currency: CURRENCY_CODE,
      refunded: false,
      supported: false,
    };
  }

  async chatbaseRefund(_organizationId: string) {
    return {
      ok: false,
      supported: false,
      // The caller branches on `refunded` to decide whether to email the
      // customer. Always false here: this path never moves money in Hookpost.
      refunded: false,
      amount: 0,
      currency: CURRENCY_CODE,
    };
  }

  async lifetimeDeal(organizationId: string, code: string) {
    // Lifetime codes are validated locally; no payment provider involved.
    const exists = await this._subscriptionService.getCode(code);
    if (!exists) return { ok: false, reason: 'invalid_code' };
    return { ok: true };
  }

  async checkValidCard(_event: any) {
    // Stripe pre-authorises a small amount to validate a card. Razorpay's
    // mandate authorisation already does this at checkout time.
    return { ok: true };
  }
}
