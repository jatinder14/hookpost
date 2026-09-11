import { IsIn, IsOptional } from 'class-validator';

export class BillingSubscribeDto {
  @IsIn(['MONTHLY', 'YEARLY'])
  period: 'MONTHLY' | 'YEARLY';

  @IsIn(['STANDARD', 'PRO', 'TEAM', 'ULTIMATE'])
  billing: 'STANDARD' | 'PRO' | 'TEAM' | 'ULTIMATE';

  @IsOptional()
  @IsIn(['INR', 'USD'])
  currency?: 'INR' | 'USD';

  utm: string;

  dub: string;

  datafast_session_id: string;
  datafast_visitor_id: string;
}

