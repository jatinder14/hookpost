import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GetUserFromRequest } from '@hookpost/nestjs-libraries/user/user.from.request';
import { Prisma, User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ErrorsService } from '@hookpost/nestjs-libraries/database/prisma/errors/errors.service';
import { AdminStatsService } from '@hookpost/nestjs-libraries/database/prisma/admin-stats/admin-stats.service';
import { PrismaRepository } from '@hookpost/nestjs-libraries/database/prisma/prisma.service';
import dayjs from 'dayjs';
import { RazorpayClient } from '@hookpost/nestjs-libraries/services/razorpay.client';

@ApiTags('Admin')
@Controller('/admin')
export class AdminController {
  constructor(
    private _errorsService: ErrorsService,
    private _adminStatsService: AdminStatsService,
    private _user: PrismaRepository<'user'>,
    private _organization: PrismaRepository<'organization'>,
    private _subscription: PrismaRepository<'subscription'>,
    private _integration: PrismaRepository<'integration'>,
    private _post: PrismaRepository<'post'>,
    private _contactMessage: PrismaRepository<'contactMessage'>
  ) {}

  private readonly _razorpay = new RazorpayClient();
  private _checkoutCache?: { at: number; data: Record<string, any> };

  private assertSuperAdmin(user: User) {
    if (!user?.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }
  }

  @Get('/users')
  async listUsers(
    @GetUserFromRequest() user: User,
    @Query('search') search?: string,
    @Query('tier') tier?: string
  ) {
    this.assertSuperAdmin(user);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              {
                organizations: {
                  some: {
                    organization: {
                      name: { contains: search, mode: 'insensitive' },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [users, totalUsers, totalOrgs, totalSubscriptions, totalIntegrations, totalPosts] =
      await Promise.all([
        this._user.model.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            isSuperAdmin: true,
            activated: true,
            providerName: true,
            createdAt: true,
            organizations: {
              select: {
                // The UserOrganization id - what the impersonate cookie must
                // hold (auth.middleware resolves it with getUserOrg).
                id: true,
                role: true,
                organization: {
                  select: {
                    id: true,
                    name: true,
                    paymentId: true,
                    allowTrial: true,
                    isTrailing: true,
                    createdAt: true,
                    subscription: {
                      select: {
                        id: true,
                        subscriptionTier: true,
                        isLifetime: true,
                        period: true,
                        totalChannels: true,
                        cancelAt: true,
                        createdAt: true,
                      },
                    },
                    _count: {
                      select: {
                        Integration: true,
                        post: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        this._user.model.user.count({ where: { deletedAt: null } }),
        this._organization.model.organization.count({ where: { deletedAt: null } }),
        this._subscription.model.subscription.count({ where: { deletedAt: null } }),
        this._integration.model.integration.count({ where: { deletedAt: null } }),
        this._post.model.post.count({ where: { deletedAt: null } }),
      ]);

    const activeTrials = users.filter((u) =>
      u.organizations.some(
        (o) => o.organization.isTrailing && !o.organization.subscription
      )
    ).length;

    return {
      metrics: {
        totalUsers,
        totalOrgs,
        totalSubscriptions,
        activeTrials,
        totalIntegrations,
        totalPosts,
      },
      users,
    };
  }

  /**
   * Per-workspace checkout intent, read live from Razorpay.
   *
   * Opening checkout creates a Razorpay subscription (tagged notes.orgId), and
   * authorising the UPI/card mandate takes a small refundable payment (Rs 5)
   * against the customer. So "opened N times, never paid", "Rs 5 failed" and
   * "Rs 5 paid" separate someone who wanted to pay from someone who looked.
   * The account is shared with VetNow, hence the notes.service filter.
   * Cached for two minutes: it walks every payment and subscription.
   */
  @Get('/checkout-signals')
  async checkoutSignals(
    @GetUserFromRequest() user: User,
    @Query('fresh') fresh?: string
  ) {
    this.assertSuperAdmin(user);
    if (!fresh && this._checkoutCache && Date.now() - this._checkoutCache.at < 120_000) {
      return this._checkoutCache.data;
    }

    const all = async (path: string) => {
      const items: any[] = [];
      for (let skip = 0; skip < 2000; skip += 100) {
        const page: any = await this._razorpay.request(
          'GET',
          `${path}?count=100&skip=${skip}`
        );
        items.push(...(page?.items || []));
        if (!page?.items || page.items.length < 100) break;
      }
      return items;
    };

    const [subscriptions, payments, orgs] = await Promise.all([
      all('/subscriptions'),
      all('/payments'),
      this._organization.model.organization.findMany({
        where: { paymentId: { not: null } },
        select: { id: true, paymentId: true },
      }),
    ]);

    const customerToOrg: Record<string, string> = {};
    for (const o of orgs) if (o.paymentId) customerToOrg[o.paymentId] = o.id;

    const out: Record<string, any> = {};
    const bucket = (orgId: string) =>
      (out[orgId] ||= {
        checkoutsOpened: 0,
        currencies: [] as string[],
        lastOpenedAt: null as string | null,
        authenticated: false,
        failedAuthAttempts: 0,
        payments: [] as any[],
      });

    for (const sub of subscriptions) {
      const notes = sub?.notes || {};
      if (notes.service !== 'hookpost' || !notes.orgId) continue;
      if (sub.customer_id) customerToOrg[sub.customer_id] ||= notes.orgId;
      const b = bucket(notes.orgId);
      b.checkoutsOpened += 1;
      if (notes.currency && !b.currencies.includes(notes.currency)) {
        b.currencies.push(notes.currency);
      }
      const at = new Date(sub.created_at * 1000).toISOString();
      if (!b.lastOpenedAt || at > b.lastOpenedAt) b.lastOpenedAt = at;
      if (['authenticated', 'active', 'pending', 'halted', 'completed'].includes(sub.status) || sub.paid_count > 0) {
        b.authenticated = true;
      }
      b.failedAuthAttempts += sub.auth_attempts || 0;
    }

    for (const pay of payments) {
      const orgId = pay?.customer_id && customerToOrg[pay.customer_id];
      if (!orgId) continue;
      bucket(orgId).payments.push({
        id: pay.id,
        status: pay.status,
        amount: pay.amount / 100,
        currency: pay.currency,
        method: pay.method,
        at: new Date(pay.created_at * 1000).toISOString(),
        error: pay.error_description || null,
      });
    }
    for (const b of Object.values(out)) {
      b.payments.sort((x: any, y: any) => (x.at < y.at ? 1 : -1));
    }

    this._checkoutCache = { at: Date.now(), data: out };
    return out;
  }

  @Get('/errors')
  async listErrors(
    @GetUserFromRequest() user: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('platform') platform?: string,
    @Query('email') email?: string,
    @Query('unknownFirst') unknownFirst?: string
  ) {
    this.assertSuperAdmin(user);
    return this._errorsService.listErrors({
      page: page ? parseInt(page, 10) : 0,
      limit: limit ? parseInt(limit, 10) : 20,
      platform: platform || undefined,
      email: email || undefined,
      unknownFirst: unknownFirst === 'true' || unknownFirst === '1',
    });
  }

  @Get('/errors/platforms')
  async listPlatforms(@GetUserFromRequest() user: User) {
    this.assertSuperAdmin(user);
    return this._errorsService.listPlatforms();
  }

  @Get('/stats')
  async getStats(
    @GetUserFromRequest() user: User,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('unknownOnly') unknownOnly?: string
  ) {
    this.assertSuperAdmin(user);

    const fromDate = from ? dayjs(from) : dayjs().subtract(30, 'day');
    const toDate = to ? dayjs(to) : dayjs();

    return this._adminStatsService.getStats({
      from: fromDate.startOf('day').toDate(),
      to: toDate.endOf('day').toDate(),
      unknownOnly: unknownOnly === 'true' || unknownOnly === '1',
    });
  }

  // ---------------------------------------------------------------------------
  // Contact messages
  // ---------------------------------------------------------------------------

  @Get('/contact-messages')
  async listContactMessages(
    @GetUserFromRequest() user: User,
    @Query('state') state?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    this.assertSuperAdmin(user);

    const take = Math.min(Math.max(parseInt(limit || '25', 10) || 25, 1), 100);
    const skip = (Math.max(parseInt(page || '1', 10) || 1, 1) - 1) * take;

    const where: Prisma.ContactMessageWhereInput = {
      ...(state && state !== 'ALL'
        ? { state: state as Prisma.EnumContactMessageStateFilter['equals'] }
        : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { message: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [messages, total, newCount, failedCount] = await Promise.all([
      this._contactMessage.model.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this._contactMessage.model.contactMessage.count({ where }),
      this._contactMessage.model.contactMessage.count({ where: { state: 'NEW' } }),
      // Rows whose notification email never left. These are the ones that would
      // have vanished entirely under the old email-only design.
      this._contactMessage.model.contactMessage.count({
        where: { emailSent: false },
      }),
    ]);

    return { messages, total, newCount, failedCount };
  }

  @Post('/contact-messages/:id/state')
  async setContactMessageState(
    @GetUserFromRequest() user: User,
    @Param('id') id: string,
    @Body('state') state: string
  ) {
    this.assertSuperAdmin(user);

    if (!['NEW', 'READ', 'DONE'].includes(state)) {
      throw new HttpException('Invalid state', 400);
    }

    await this._contactMessage.model.contactMessage.update({
      where: { id },
      data: { state: state as any },
    });

    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // Super Admin Management & User Journey
  // ---------------------------------------------------------------------------

  @Post('/users/:id/super-admin')
  async toggleSuperAdmin(
    @GetUserFromRequest() user: User,
    @Param('id') targetUserId: string,
    @Body('isSuperAdmin') isSuperAdmin: boolean
  ) {
    this.assertSuperAdmin(user);

    if (user.id === targetUserId && !isSuperAdmin) {
      throw new HttpException('Cannot revoke your own super admin access', 400);
    }

    const updated = await this._user.model.user.update({
      where: { id: targetUserId },
      data: { isSuperAdmin: Boolean(isSuperAdmin) },
      select: {
        id: true,
        email: true,
        name: true,
        isSuperAdmin: true,
      },
    });

    return { ok: true, user: updated };
  }

  @Get('/users/:id/journey')
  async getUserJourney(
    @GetUserFromRequest() user: User,
    @Param('id') targetUserId: string
  ): Promise<Record<string, any>> {
    this.assertSuperAdmin(user);

    const targetUser: any = await this._user.model.user.findUnique({
      where: { id: targetUserId },
      include: {
        organizations: {
          include: {
            organization: {
              include: {
                subscription: true,
                Integration: {
                  select: {
                    id: true,
                    name: true,
                    providerIdentifier: true,
                    picture: true,
                    disabled: true,
                    createdAt: true,
                    updatedAt: true,
                    inBetweenSteps: true,
                  },
                },
                post: {
                  orderBy: { createdAt: 'desc' },
                  take: 50,
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    publishDate: true,
                    state: true,
                    releaseURL: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!targetUser) {
      throw new HttpException('User not found', 404);
    }

    interface JourneyEvent {
      id: string;
      type: 'SIGNUP' | 'WORKSPACE' | 'CHANNEL' | 'POST' | 'BILLING';
      title: string;
      description: string;
      timestamp: Date;
      metadata?: Record<string, any>;
      status?: 'success' | 'warning' | 'info' | 'error';
    }

    const events: JourneyEvent[] = [];

    // 1. Signup Event
    events.push({
      id: `signup-${targetUser.id}`,
      type: 'SIGNUP',
      title: 'Signed Up to Hookpost',
      description: `Registered via ${targetUser.providerName || 'Email'}${
        targetUser.activated ? ' (Verified)' : ' (Pending verification)'
      }`,
      timestamp: targetUser.createdAt,
      status: 'success',
      metadata: {
        email: targetUser.email,
        isSuperAdmin: targetUser.isSuperAdmin,
      },
    });

    // 2. Workspaces, Channels, Posts & Subscriptions
    for (const uo of targetUser.organizations) {
      const org = uo.organization;
      events.push({
        id: `org-${org.id}`,
        type: 'WORKSPACE',
        title: `Workspace: ${org.name}`,
        description: `Member role: ${uo.role}. ${
          org.isTrailing ? 'Status: 7-day trial active.' : 'Status: Active.'
        }`,
        timestamp: org.createdAt,
        status: 'info',
        metadata: {
          organizationId: org.id,
          role: uo.role,
          paymentId: org.paymentId,
        },
      });

      if (org.subscription) {
        events.push({
          id: `sub-${org.subscription.id}`,
          type: 'BILLING',
          title: `Subscription Plan: ${org.subscription.subscriptionTier}`,
          description: `Plan: ${org.subscription.subscriptionTier} (${
            org.subscription.period
          }). Channels allowed: ${org.subscription.totalChannels}. ${
            org.subscription.isLifetime ? 'Lifetime access.' : ''
          }`,
          timestamp: org.subscription.createdAt,
          status: 'success',
          metadata: {
            tier: org.subscription.subscriptionTier,
            period: org.subscription.period,
            channels: org.subscription.totalChannels,
          },
        });
      }

      for (const integ of org.Integration) {
        events.push({
          id: `integ-${integ.id}`,
          type: 'CHANNEL',
          title: `Connected Channel: ${integ.name || integ.providerIdentifier}`,
          description: `Platform: ${integ.providerIdentifier}. Status: ${
            integ.disabled
              ? 'Disabled'
              : integ.inBetweenSteps
              ? 'Needs Reconnect'
              : 'Active'
          }`,
          timestamp: integ.createdAt,
          status: integ.disabled
            ? 'error'
            : integ.inBetweenSteps
            ? 'warning'
            : 'success',
          metadata: {
            channelId: integ.id,
            provider: integ.providerIdentifier,
            name: integ.name,
            picture: integ.picture,
          },
        });
      }

      for (const p of org.post) {
        const snippet = (p.content || '').slice(0, 100);
        events.push({
          id: `post-${p.id}`,
          type: 'POST',
          title:
            p.state === 'PUBLISHED'
              ? 'Published Social Post'
              : p.state === 'QUEUE'
              ? 'Scheduled Post'
              : 'Draft Post',
          description: snippet ? `"${snippet}..."` : 'Social media post',
          timestamp: p.publishDate || p.createdAt,
          status:
            p.state === 'PUBLISHED'
              ? 'success'
              : p.state === 'ERROR'
              ? 'error'
              : 'info',
          metadata: {
            postId: p.id,
            state: p.state,
            releaseURL: p.releaseURL,
          },
        });
      }
    }

    events.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const totalWorkspaces = targetUser.organizations.length;
    const totalIntegrations = targetUser.organizations.reduce(
      (sum, uo) => sum + uo.organization.Integration.length,
      0
    );
    const totalPosts = targetUser.organizations.reduce(
      (sum, uo) => sum + uo.organization.post.length,
      0
    );
    const publishedPosts = targetUser.organizations.reduce(
      (sum, uo) =>
        sum + uo.organization.post.filter((p) => p.state === 'PUBLISHED').length,
      0
    );
    const hasActiveSubscription = targetUser.organizations.some(
      (uo) => !!uo.organization.subscription
    );
    const isTrailing = targetUser.organizations.some(
      (uo) => uo.organization.isTrailing
    );

    return {
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        isSuperAdmin: targetUser.isSuperAdmin,
        activated: targetUser.activated,
        providerName: targetUser.providerName,
        createdAt: targetUser.createdAt,
      },
      summary: {
        totalWorkspaces,
        totalIntegrations,
        totalPosts,
        publishedPosts,
        hasActiveSubscription,
        isTrailing,
      },
      events,
    };
  }
}
