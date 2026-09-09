import { Resend } from 'resend';
import {
  Body,
  Ip,
  Headers,
  Logger,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from '@hookpost/nestjs-libraries/database/prisma/posts/posts.service';
import { TrackService } from '@hookpost/nestjs-libraries/track/track.service';
import { RealIP } from 'nestjs-real-ip';
import { UserAgent } from '@hookpost/nestjs-libraries/user/user.agent';
import { TrackEnum } from '@hookpost/nestjs-libraries/user/track.enum';
import { Request, Response } from 'express';
import { makeId } from '@hookpost/nestjs-libraries/services/make.is';
import { getCookieUrlFromDomain } from '@hookpost/helpers/subdomain/subdomain.management';
import { AgentGraphInsertService } from '@hookpost/nestjs-libraries/agent/agent.graph.insert.service';
import { SubscriptionService } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { AuthService } from '@hookpost/helpers/auth/auth.service';
import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { Readable, pipeline } from 'stream';
import { promisify } from 'util';
import { OnlyURL } from '@hookpost/nestjs-libraries/dtos/webhooks/webhooks.dto';
import { isSafePublicHttpsUrl } from '@hookpost/nestjs-libraries/dtos/webhooks/webhook.url.validator';
import { ssrfSafeDispatcher } from '@hookpost/nestjs-libraries/dtos/webhooks/ssrf.safe.dispatcher';
import { PrismaRepository } from '@hookpost/nestjs-libraries/database/prisma/prisma.service';

const pump = promisify(pipeline);

@ApiTags('Public')
@Controller('/public')
export class PublicController {
  constructor(
    private _trackService: TrackService,
    private _agentGraphInsertService: AgentGraphInsertService,
    private _postsService: PostsService,
    private _subscriptionService: SubscriptionService,
    private _contactMessage: PrismaRepository<'contactMessage'>
  ) {}
  @Post('/agent')
  async createAgent(@Body() body: { text: string; apiKey: string }) {
    if (
      !body.apiKey ||
      !process.env.AGENT_API_KEY ||
      body.apiKey !== process.env.AGENT_API_KEY
    ) {
      return;
    }
    return this._agentGraphInsertService.newPost(body.text);
  }

  @Get(`/posts/:id`)
  async getPreview(@Param('id') id: string) {
    return (await this._postsService.getPostsRecursively(id, true)).map(
      ({ childrenPost, ...p }) => ({
        ...p,
        ...(p.integration
          ? {
              integration: {
                id: p.integration.id,
                name: p.integration.name,
                picture: p.integration.picture,
                providerIdentifier: p.integration.providerIdentifier,
                profile: p.integration.profile,
              },
            }
          : {}),
      })
    );
  }

  @Get(`/posts/:id/comments`)
  async getComments(@Param('id') postId: string) {
    return { comments: await this._postsService.getComments(postId) };
  }

  @Post('/t')
  async trackEvent(
    @Res() res: Response,
    @Req() req: Request,
    @RealIP() ip: string,
    @UserAgent() userAgent: string,
    @Body()
    body: { fbclid?: string; tt: TrackEnum; additional: Record<string, any> }
  ) {
    const uniqueId = req?.cookies?.track || makeId(10);
    const fbclid = req?.cookies?.fbclid || body.fbclid;
    // A tracking beacon must never be able to fail the request. track() ends in
    // eventRequest.execute(), a live HTTPS POST to graph.facebook.com that
    // rejects on ANY non-2xx - expired token, malformed event, rate limit, or a
    // network blip. Unguarded, that rejection propagated out of the handler and
    // Nest answered 500, which is exactly what /public/t was returning in
    // production: every ViewContent from every marketing page, failing.
    // razorpay.service.ts already wraps its identical call in try/catch; this
    // one and users.controller.ts POST /user/t did not.
    try {
      await this._trackService.track(
        uniqueId,
        ip,
        userAgent,
        body.tt,
        body.additional,
        fbclid
      );
    } catch (e) {
      Logger.error(`ViewContent tracking failed (non-fatal): ${e}`);
    }
    if (!req.cookies.track) {
      res.cookie('track', uniqueId, {
        domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
        // sameSite must sit INSIDE the secure branch: browsers reject
        // SameSite=None without Secure, so in NOT_SECURED mode the cookie was
        // silently dropped, every request minted a fresh id, and server/browser
        // event de-duplication broke. users.controller.ts already scopes it
        // correctly.
        ...(!process.env.NOT_SECURED
          ? {
              secure: true,
              httpOnly: true,
              sameSite: 'none' as const,
            }
          : {}),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });
    }

    if (body.fbclid && !req.cookies.fbclid) {
      res.cookie('fbclid', body.fbclid, {
        domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
        // sameSite must sit INSIDE the secure branch: browsers reject
        // SameSite=None without Secure, so in NOT_SECURED mode the cookie was
        // silently dropped, every request minted a fresh id, and server/browser
        // event de-duplication broke. users.controller.ts already scopes it
        // correctly.
        ...(!process.env.NOT_SECURED
          ? {
              secure: true,
              httpOnly: true,
              sameSite: 'none' as const,
            }
          : {}),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });
    }

    res.status(200).json({
      track: uniqueId,
    });
  }

  @Post('/modify-subscription')
  async modifySubscription(@Body('params') params: string) {
    try {
      const load = AuthService.verifyJWT(params) as {
        orgId: string;
        billing: 'FREE' | 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE';
      };

      if (!load || !load.orgId || !load.billing || !pricing[load.billing]) {
        return { success: false };
      }

      const totalChannels = pricing[load.billing].channel || 0;

      await this._subscriptionService.modifySubscriptionByOrg(
        load.orgId,
        totalChannels,
        load.billing
      );

      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }


  @Get('/stream')
  async streamFile(
    @Query() query: OnlyURL,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const { url } = query;
    if (!url.endsWith('mp4')) {
      return res.status(400).send('Invalid video URL');
    }

    const ac = new AbortController();
    const onClose = () => ac.abort();
    req.on('aborted', onClose);
    res.on('close', onClose);

    // Manually follow redirects so every hop is re-validated against
    // the SSRF blocklist (see GHSA-34w8-5j2v-h6ww). `fetch` defaults to
    // `redirect: 'follow'`, which bypasses the DTO-level URL check.
    const MAX_REDIRECTS = 5;
    let currentUrl = url;
    let r: globalThis.Response | undefined;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (!(await isSafePublicHttpsUrl(currentUrl))) {
        return res.status(400).send('Blocked URL');
      }

      r = await fetch(currentUrl, {
        signal: ac.signal,
        redirect: 'manual',
        // @ts-ignore — undici option, not in lib.dom fetch types
        dispatcher: ssrfSafeDispatcher,
      });

      if (r.status >= 300 && r.status < 400) {
        const location = r.headers.get('location');
        if (!location) {
          return res.status(502).send('Redirect without Location');
        }
        try {
          currentUrl = new URL(location, currentUrl).toString();
        } catch {
          return res.status(400).send('Invalid redirect target');
        }
        continue;
      }

      break;
    }

    if (!r) {
      return res.status(502).send('No upstream response');
    }

    if (r.status >= 300 && r.status < 400) {
      return res.status(508).send('Too many redirects');
    }

    if (!r.ok && r.status !== 206) {
      res.status(r.status);
      throw new Error(`Upstream error: ${r.statusText}`);
    }

    const type = r.headers.get('content-type') ?? 'application/octet-stream';
    res.setHeader('Content-Type', type);

    const contentRange = r.headers.get('content-range');
    if (contentRange) res.setHeader('Content-Range', contentRange);

    const len = r.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);

    const acceptRanges = r.headers.get('accept-ranges') ?? 'bytes';
    res.setHeader('Accept-Ranges', acceptRanges);

    if (r.status === 206) res.status(206); // Partial Content for range responses

    try {
      await pump(Readable.fromWeb(r.body as any), res);
    } catch (err) {}
  }

  // ---------------------------------------------------------------------------
  // Contact form
  // ---------------------------------------------------------------------------

  // A public endpoint that sends mail is a spam vector, so this is deliberately
  // narrow: a honeypot field bots fill and humans never see, one submission per
  // IP per minute, and hard length caps.
  //
  // The submission is written to the database BEFORE the email is attempted.
  // The email is a notification, not the record - previously a Resend outage or
  // a spam folder lost the request entirely, with nothing left to recover from.
  @Post('/contact')
  async contact(
    @Ip() directIp: string,
    @Headers() headers: Record<string, string>,
    @Body()
    body: {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
      website?: string;
    }
  ) {
    // Honeypot. A real form hides this field; a bot fills every input it finds.
    // Returns success so the bot has nothing to learn from the response.
    if (body?.website) {
      return { ok: true };
    }

    // @Ip() is 127.0.0.1 for every request here - NGINX proxies to the backend
    // and Express has no trust-proxy setting, so without this the per-IP limit
    // below would be one submission per minute for the entire internet.
    // Cloudflare sits in front of NGINX, so its header is the truthful one.
    const ip =
      headers['cf-connecting-ip'] ||
      (headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      directIp;

    const name = (body?.name || '').trim().slice(0, 100);
    const email = (body?.email || '').trim().slice(0, 200);
    const topic = (body?.topic || 'Support').trim().slice(0, 60);
    const message = (body?.message || '').trim().slice(0, 5000);

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { ok: false, error: 'Enter an email address we can reply to.' };
    }
    if (message.length < 10) {
      return { ok: false, error: 'Tell us a little more so we can help.' };
    }

    // Rate limit off the database rather than an in-process Map. The Map reset
    // on every PM2 restart, and was not shared between workers, so it enforced
    // nothing reliable. Keyed on IP *and* email so two people behind one office
    // or carrier NAT do not silently block each other.
    const since = new Date(Date.now() - 60_000);
    const recent = await this._contactMessage.model.contactMessage.findFirst({
      where: { createdAt: { gte: since }, OR: [{ ip }, { email }] },
      select: { id: true },
    });
    if (recent) {
      return { ok: false, error: 'Just sent one - give it a minute.' };
    }

    const saved = await this._contactMessage.model.contactMessage.create({
      data: {
        name: name || null,
        email,
        topic,
        message,
        ip: ip || null,
        userAgent: (headers['user-agent'] || '').slice(0, 500) || null,
      },
      select: { id: true },
    });

    // Notification only. The row above is the record, so a failure here still
    // leaves the message visible in the admin panel - it is flagged so support
    // knows the inbox did not get a copy.
    const supportAddress =
      process.env.EMAIL_FROM_ADDRESS || 'support@hookstep.in';
    const apiKey = process.env.RESEND_API_KEY || '';

    if (!apiKey) {
      Logger.error('Contact form received a message but RESEND_API_KEY is unset');
      await this._contactMessage.model.contactMessage.update({
        where: { id: saved.id },
        data: { emailSent: false, emailError: 'RESEND_API_KEY is unset' },
      });
      return { ok: true };
    }

    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: `Hookpost Contact <${supportAddress}>`,
        to: supportAddress,
        // Resend 3.5.0 takes snake_case here, so a reply from support goes
        // back to the person who wrote in rather than to support itself.
        reply_to: email,
        subject: `[${topic}] ${name || email}`,
        text:
          `From:  ${name || '(no name)'} <${email}>\n` +
          `Topic: ${topic}\n\n${message}\n`,
      });
      await this._contactMessage.model.contactMessage.update({
        where: { id: saved.id },
        data: { emailSent: true },
      });
    } catch (e) {
      // The person still gets a success screen: their message is saved and will
      // be read. Telling them to try again would only create a duplicate.
      Logger.error(`Contact form email failed (message ${saved.id} saved): ${e}`);
      await this._contactMessage.model.contactMessage.update({
        where: { id: saved.id },
        data: { emailSent: false, emailError: String(e).slice(0, 500) },
      });
    }

    return { ok: true };
  }
}
