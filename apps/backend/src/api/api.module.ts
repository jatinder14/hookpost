import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from '@hookpost/backend/api/routes/auth.controller';
import { AuthService } from '@hookpost/backend/services/auth/auth.service';
import { UsersController } from '@hookpost/backend/api/routes/users.controller';
import { AuthMiddleware } from '@hookpost/backend/services/auth/auth.middleware';
import { RazorpayController } from '@hookpost/backend/api/routes/razorpay.controller';
import { RazorpayService } from '@hookpost/nestjs-libraries/services/razorpay.service';
import { AnalyticsController } from '@hookpost/backend/api/routes/analytics.controller';
import { PoliciesGuard } from '@hookpost/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@hookpost/backend/services/auth/permissions/permissions.service';
import { IntegrationsController } from '@hookpost/backend/api/routes/integrations.controller';
import { IntegrationManager } from '@hookpost/nestjs-libraries/integrations/integration.manager';
import { SettingsController } from '@hookpost/backend/api/routes/settings.controller';
import { PostsController } from '@hookpost/backend/api/routes/posts.controller';
import { MediaController } from '@hookpost/backend/api/routes/media.controller';
import { UploadModule } from '@hookpost/nestjs-libraries/upload/upload.module';
import { BillingController } from '@hookpost/backend/api/routes/billing.controller';
import { NotificationsController } from '@hookpost/backend/api/routes/notifications.controller';
import { OpenaiService } from '@hookpost/nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@hookpost/nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@hookpost/nestjs-libraries/services/codes.service';
import { CopilotController } from '@hookpost/backend/api/routes/copilot.controller';
import { PublicController } from '@hookpost/backend/api/routes/public.controller';
import { RootController } from '@hookpost/backend/api/routes/root.controller';
import { TrackService } from '@hookpost/nestjs-libraries/track/track.service';
import { ShortLinkService } from '@hookpost/nestjs-libraries/short-linking/short.link.service';
import { WebhookController } from '@hookpost/backend/api/routes/webhooks.controller';
import { SignatureController } from '@hookpost/backend/api/routes/signature.controller';
import { AutopostController } from '@hookpost/backend/api/routes/autopost.controller';
import { SetsController } from '@hookpost/backend/api/routes/sets.controller';
import { ThirdPartyController } from '@hookpost/backend/api/routes/third-party.controller';
import { MonitorController } from '@hookpost/backend/api/routes/monitor.controller';
import { NoAuthIntegrationsController } from '@hookpost/backend/api/routes/no.auth.integrations.controller';
import { EnterpriseController } from '@hookpost/backend/api/routes/enterprise.controller';
import { OAuthAppController } from '@hookpost/backend/api/routes/oauth-app.controller';
import { ApprovedAppsController } from '@hookpost/backend/api/routes/approved-apps.controller';
import {
  OAuthController,
  OAuthAuthorizedController,
} from '@hookpost/backend/api/routes/oauth.controller';
import { AnnouncementsController } from '@hookpost/backend/api/routes/announcements.controller';
import { MetaCallbacksController } from '@hookpost/backend/api/routes/meta.callbacks.controller';
import { AdminController } from '@hookpost/backend/api/routes/admin.controller';
import { AuthProviderManager } from '@hookpost/backend/services/auth/providers/providers.manager';
import { GithubProvider } from '@hookpost/backend/services/auth/providers/github.provider';
import { GoogleProvider } from '@hookpost/backend/services/auth/providers/google.provider';
import { AppleProvider } from '@hookpost/backend/services/auth/providers/apple.provider';
import { FarcasterProvider } from '@hookpost/backend/services/auth/providers/farcaster.provider';
import { WalletProvider } from '@hookpost/backend/services/auth/providers/wallet.provider';
import { OauthProvider } from '@hookpost/backend/services/auth/providers/oauth.provider';

const authenticatedController = [
  UsersController,
  AnalyticsController,
  IntegrationsController,
  SettingsController,
  PostsController,
  MediaController,
  BillingController,
  NotificationsController,
  CopilotController,
  WebhookController,
  SignatureController,
  AutopostController,
  SetsController,
  ThirdPartyController,
  OAuthAppController,
  ApprovedAppsController,
  OAuthAuthorizedController,
  AnnouncementsController,
  AdminController,
];
@Module({
  imports: [UploadModule],
  controllers: process.env.MCP_ONLY
    ? [RootController, OAuthController]
    : [
        RootController,
        RazorpayController,
        AuthController,
        PublicController,
        MonitorController,
        EnterpriseController,
        NoAuthIntegrationsController,
        MetaCallbacksController,
        OAuthController,
        ...authenticatedController,
      ],
  providers: [
    AuthService,
    RazorpayService,
    OpenaiService,
    ExtractContentService,
    AuthMiddleware,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
    TrackService,
    ShortLinkService,
    AuthProviderManager,
    GithubProvider,
    GoogleProvider,
    AppleProvider,
    FarcasterProvider,
    WalletProvider,
    OauthProvider,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...authenticatedController);
  }
}
