import {
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { RazorpayService } from '@hookpost/nestjs-libraries/services/razorpay.service';
import { RazorpayClient } from '@hookpost/nestjs-libraries/services/razorpay.client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Razorpay')
@Controller('/razorpay')
export class RazorpayController {
  private readonly logger = new Logger(RazorpayController.name);
  private readonly client = new RazorpayClient();

  constructor(private readonly _razorpayService: RazorpayService) {}

  /**
   * Single webhook endpoint. Razorpay posts every subscribed event here, so the
   * service does the branching.
   *
   * The signature is computed over the raw bytes, which is why this reads
   * req.rawBody (enabled via `rawBody: true` in main.ts) rather than the parsed
   * body -- JSON.stringify of the parsed object would not round-trip byte-exact.
   */
  @Post('/')
  async webhook(@Req() req: RawBodyRequest<Request>) {
    let event: any;
    try {
      event = this._razorpayService.validateRequest(
        req.rawBody!,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.headers['x-razorpay-signature'],
        process.env.RAZORPAY_WEBHOOK_SECRET!
      );
    } catch (e) {
      // A bad signature is not our bug -- reject it and do not retry.
      this.logger.warn(`Rejected Razorpay webhook: ${e}`);
      throw new HttpException('Invalid signature', 400);
    }

    // Ignore events originating from a different product sharing this account.
    const service = event?.payload?.subscription?.entity?.notes?.service;
    if (service && service !== 'hookpost') {
      return { ok: true };
    }

    try {
      return await this._razorpayService.handleWebhook(event);
    } catch (e) {
      this.logger.error(`Razorpay webhook handling failed: ${e}`);
      // 500 makes Razorpay retry with backoff, which is what we want for
      // transient database failures.
      throw new HttpException('Webhook handling failed', 500);
    }
  }

  /**
   * Called by the frontend right after the Razorpay Checkout modal succeeds.
   * The webhook is the source of truth for entitlements; this endpoint exists
   * so the UI can confirm the handshake instantly instead of polling.
   */
  @Post('/verify')
  async verify(
    @Body()
    body: {
      razorpay_payment_id: string;
      razorpay_subscription_id: string;
      razorpay_signature: string;
    }
  ) {
    const valid = this.client.verifySubscriptionPayment(
      body.razorpay_subscription_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
    if (!valid) {
      throw new HttpException('Invalid payment signature', 400);
    }

    // Immediately provision entitlements so user never gets stuck on trial/billing page
    try {
      await this._razorpayService.syncSubscriptionById(
        body.razorpay_subscription_id
      );
    } catch (e) {
      this.logger.error(
        `Error auto-provisioning verified subscription ${body.razorpay_subscription_id}: ${e}`
      );
    }

    return { ok: true };
  }
}
