import { Controller, Get, Header, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Organization } from '@prisma/client';
import { GetOrgFromRequest } from '@hookpost/nestjs-libraries/user/org.from.request';
import { ClippingService } from '@hookpost/nestjs-libraries/database/prisma/clipping/clipping.service';

@ApiTags('Clipping')
@Controller('/clipping-widget')
export class ClippingWidgetController {
  constructor(private _clippingService: ClippingService) {}

  @Get('/status')
  @Header('Cache-Control', 'no-store')
  status(
    @GetOrgFromRequest() org: Organization,
    @Req() req: Request,
    @Query('seen') seen?: string
  ) {
    return this._clippingService.getWidgetProgress(
      org.id,
      // @ts-ignore
      req.clippingId,
      !!seen
    );
  }
}
