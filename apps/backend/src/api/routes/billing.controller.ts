import { Body, Controller, Get, HttpException, Param, Post, Req } from '@nestjs/common';
import { SubscriptionService } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { RazorpayService } from '@hookpost/nestjs-libraries/services/razorpay.service';
import { GetOrgFromRequest } from '@hookpost/nestjs-libraries/user/org.from.request';
import { Organization, User } from '@prisma/client';
import { BillingSubscribeDto } from '@hookpost/nestjs-libraries/dtos/billing/billing.subscribe.dto';
import { AdminApplyCouponDto } from '@hookpost/nestjs-libraries/dtos/billing/admin.apply.coupon.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUserFromRequest } from '@hookpost/nestjs-libraries/user/user.from.request';
import { NotificationService } from '@hookpost/nestjs-libraries/database/prisma/notifications/notification.service';
import { Request } from 'express';
import { AuthService } from '@hookpost/helpers/auth/auth.service';
import { UsersService } from '@hookpost/nestjs-libraries/database/prisma/users/users.service';
import { OrganizationService } from '@hookpost/nestjs-libraries/database/prisma/organizations/organization.service';
import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Why the admin coupon tool cannot apply anything on this deployment. Upstream
// built it for a card provider that can re-price a live subscription. Razorpay
// cannot: a UPI Autopay mandate fixes the amount at signup, and Offers can only
// be created in the Razorpay dashboard and attached when a subscription is
// created. The old stubs returned a shape the modal did not expect (no
// `coupons` array) and it crashed on `info.coupons.length`.
const COUPON_UNSUPPORTED_REASON =
  "Razorpay can't change the price of a running subscription - UPI Autopay locks the amount at signup. To discount a user, create an Offer in the Razorpay dashboard; it applies when they subscribe.";

@ApiTags('Billing')
@Controller('/billing')
export class BillingController {
  constructor(
    private _subscriptionService: SubscriptionService,
    private _razorpayService: RazorpayService,
    private _notificationService: NotificationService,
    private _usersService: UsersService,
    private _organizationService: OrganizationService
  ) {}

  private async assertNoOtherSubscribedAccount(user: User) {
    const other = await this._usersService.getUserWithActiveSubscriptionByEmail(
      user.email,
      user.id
    );
    return !!other;
  }

  @Get('/check/:id')
  async checkId(
    @GetOrgFromRequest() org: Organization,
    @Param('id') body: string
  ) {
    return {
      status: await this._razorpayService.checkSubscription(org.id, body),
    };
  }

  @Get('/check-discount')
  async checkDiscount(@GetOrgFromRequest() org: Organization) {
    return {
      offerCoupon: !(await this._razorpayService.checkDiscount(org.paymentId))
        ? false
        : AuthService.signJWT({ discount: true }),
    };
  }

  @Post('/apply-discount')
  async applyDiscount(@GetOrgFromRequest() org: Organization) {
    await this._razorpayService.applyDiscount(org.paymentId);
  }

  @Post('/finish-trial')
  async finishTrial(@GetOrgFromRequest() org: Organization) {
    try {
      if (org.paymentId) {
        await this._razorpayService.finishTrial(org.paymentId);
      }
    } catch (err) {}
    await this._organizationService.setTrialFinished(org.id);
    return {
      finish: true,
    };
  }

  @Get('/is-trial-finished')
  async isTrialFinished(@GetOrgFromRequest() org: Organization) {
    const currentOrg = await this._organizationService.getOrgById(org.id);
    return {
      finished: !currentOrg?.isTrailing,
    };
  }

  @Post('/embedded')
  async embedded(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: BillingSubscribeDto,
    @Req() req: Request
  ) {
    if (await this.assertNoOtherSubscribedAccount(user)) {
      return { blocked: true };
    }

    const uniqueId = req?.cookies?.track;
    return this._razorpayService.embedded(
      uniqueId,
      org.id,
      user.id,
      body,
      org.allowTrial
    );
  }

  @Post('/subscribe')
  async subscribe(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: BillingSubscribeDto,
    @Req() req: Request
  ) {
    if (await this.assertNoOtherSubscribedAccount(user)) {
      return { blocked: true };
    }

    const uniqueId = req?.cookies?.track;
    return this._razorpayService.subscribe(
      uniqueId,
      org.id,
      user.id,
      body,
      org.allowTrial
    );
  }

  @Get('/portal')
  async modifyPayment(@GetOrgFromRequest() org: Organization) {
    const customer = await this._razorpayService.getCustomerByOrganizationId(
      org.id
    );
    const { url } = await this._razorpayService.createBillingPortalLink(customer);
    return {
      portal: url,
    };
  }

  @Get('/')
  getCurrentBilling(@GetOrgFromRequest() org: Organization) {
    return this._subscriptionService.getSubscriptionByOrganizationId(org.id);
  }

  @Post('/cancel')
  async cancel(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: { feedback: string }
  ) {
    await this._notificationService.sendEmail(
      process.env.EMAIL_FROM_ADDRESS,
      'Subscription Cancelled',
      `Organization ${org.name} has cancelled their subscription because: ${body.feedback}`,
      user.email
    );

    return this._razorpayService.setToCancel(org.id);
  }

  @Post('/prorate')
  prorate(
    @GetOrgFromRequest() org: Organization,
    @Body() body: BillingSubscribeDto
  ) {
    return this._razorpayService.prorate(org.id, body);
  }

  @Get('/charges')
  async getCharges(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return this._razorpayService.getCharges(org.id);
  }

  @Post('/refund-charges')
  async refundCharges(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization,
    @Body() body: { chargeIds: string[] }
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return this._razorpayService.refundCharges(org.id, body.chargeIds);
  }

  @Post('/cancel-subscription')
  async cancelSubscription(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    // A workspace on the free plan has nothing to cancel. The dialog used to
    // warn "the user will be downgraded to FREE" for users already on FREE.
    const sub = await this._subscriptionService.getSubscription(org.id);
    if (!sub) {
      return {
        ok: false,
        reason: 'This workspace has no paid subscription to cancel.',
      };
    }
    if (sub.isLifetime) {
      return {
        ok: false,
        reason:
          'This is a lifetime plan with no Razorpay subscription behind it. Change the tier instead of cancelling.',
      };
    }

    return this._razorpayService.cancelSubscription(org.id);
  }

  @Get('/coupon-info')
  async couponInfo(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    const sub = await this._subscriptionService.getSubscription(org.id);
    const tier = sub?.subscriptionTier || null;
    const plan = tier ? (pricing as any)[tier] : undefined;
    return {
      tier,
      period: sub?.period || null,
      isLifetime: !!sub?.isLifetime,
      monthlyPrice: plan?.month_price || 0,
      planPrice:
        (sub?.period === 'YEARLY' ? plan?.year_price : plan?.month_price) || 0,
      nextPayment: null,
      coupons: [],
      supported: false,
      reason: COUPON_UNSUPPORTED_REASON,
    };
  }

  @Post('/apply-coupon')
  async applyCoupon(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization,
    @Body() body: AdminApplyCouponDto
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return { applied: false, reason: COUPON_UNSUPPORTED_REASON };
  }

  @Post('/cancel-coupon')
  async cancelCoupon(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return { cancelled: false, reason: COUPON_UNSUPPORTED_REASON };
  }

  @Get('/chatbase-refund/preview')
  chatbaseRefundPreview(@GetOrgFromRequest() org: Organization) {
    return this._razorpayService.chatbaseRefundPreview(org.id);
  }

  @Post('/chatbase-refund')
  async chatbaseRefund(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    const refund = await this._razorpayService.chatbaseRefund(org.id);

    if (refund.refunded) {
      await this._notificationService.sendEmail(
        process.env.EMAIL_FROM_ADDRESS,
        'Refund issued from Chatbase',
        `Organization ${org.name} received a refund of ${refund.amount} ${refund.currency} and their subscription was cancelled`,
        user.email
      );
    }

    return refund;
  }

  @Post('/add-subscription')
  async addSubscription(
    @Body() body: { subscription: string },
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new Error('Unauthorized');
    }

    await this._subscriptionService.addSubscription(
      org.id,
      user.id,
      body.subscription
    );
  }

}
