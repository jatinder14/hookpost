import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from '@hookpost/backend/services/auth/auth.service';
import { RazorpayService } from '@hookpost/nestjs-libraries/services/razorpay.service';
import { PoliciesGuard } from '@hookpost/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@hookpost/backend/services/auth/permissions/permissions.service';
import { IntegrationManager } from '@hookpost/nestjs-libraries/integrations/integration.manager';
import { UploadModule } from '@hookpost/nestjs-libraries/upload/upload.module';
import { OpenaiService } from '@hookpost/nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@hookpost/nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@hookpost/nestjs-libraries/services/codes.service';
import { PublicIntegrationsController } from '@hookpost/backend/public-api/routes/v1/public.integrations.controller';
import { PublicAuthMiddleware } from '@hookpost/backend/services/auth/public.auth.middleware';
import { SuperAdminGuard } from '@hookpost/backend/services/auth/super.admin.guard';

const authenticatedController = [PublicIntegrationsController];
@Module({
  imports: [UploadModule],
  controllers: process.env.MCP_ONLY ? [] : [...authenticatedController],
  providers: [
    AuthService,
    RazorpayService,
    OpenaiService,
    ExtractContentService,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
    SuperAdminGuard,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class PublicApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicAuthMiddleware).forRoutes(...authenticatedController);
  }
}

