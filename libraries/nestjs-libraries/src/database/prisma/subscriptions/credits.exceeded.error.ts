import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Raised when a credit reservation would exceed the plan's monthly allowance.
 *
 * The body and status deliberately match backend's SubscriptionException
 * ({ section, action } with 402), because the frontend already knows how to
 * render that shape as an upgrade prompt. It is redefined here rather than
 * imported so that nestjs-libraries does not depend on apps/backend - the
 * orchestrator compiles these libraries too.
 */
export class CreditsExceededError extends HttpException {
  constructor(type: string) {
    super(
      {
        // Mirrors the Sections enum values in
        // apps/backend/src/services/auth/permissions/permission.exception.class.ts
        section:
          type === 'ai_videos' ? 'videos_per_month' : 'ai_generation_count',
        action: 'create',
      },
      HttpStatus.PAYMENT_REQUIRED
    );
  }
}
