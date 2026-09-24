import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PURCHASABLE_TIERS } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Derived, never retyped. This used to hardcode
// ['STANDARD','PRO','TEAM','ULTIMATE'], so retiring TEAM and ULTIMATE from the
// UI left the API still accepting them - a POST with billing:'TEAM' would have
// subscribed at Rs1,499 to a plan we no longer sell. Hiding a plan in the
// frontend is not retiring it.
const SUBSCRIBABLE = PURCHASABLE_TIERS.filter((t) => t !== 'FREE');

export class BillingSubscribeDto {
  @IsIn(['MONTHLY', 'YEARLY'])
  period: 'MONTHLY' | 'YEARLY';

  @IsIn(SUBSCRIBABLE)
  billing: (typeof SUBSCRIBABLE)[number];

  @IsOptional()
  @IsIn(['INR', 'USD'])
  currency?: 'INR' | 'USD';

  utm: string;

  dub: string;

  datafast_session_id: string;
  datafast_visitor_id: string;

  // Website coupon code, applied only when a new subscription is created.
  @IsOptional()
  @IsString()
  @MaxLength(40)
  coupon?: string;
}

