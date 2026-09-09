import { Global, Module } from '@nestjs/common';
import { PrismaRepository, PrismaService, PrismaTransaction } from './prisma.service';
import { OrganizationRepository } from '@hookpost/nestjs-libraries/database/prisma/organizations/organization.repository';
import { OrganizationService } from '@hookpost/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@hookpost/nestjs-libraries/database/prisma/users/users.service';
import { UsersRepository } from '@hookpost/nestjs-libraries/database/prisma/users/users.repository';
import { SubscriptionService } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { SubscriptionRepository } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { NotificationService } from '@hookpost/nestjs-libraries/database/prisma/notifications/notification.service';
import { IntegrationService } from '@hookpost/nestjs-libraries/database/prisma/integrations/integration.service';
import { IntegrationRepository } from '@hookpost/nestjs-libraries/database/prisma/integrations/integration.repository';
import { PostsService } from '@hookpost/nestjs-libraries/database/prisma/posts/posts.service';
import { PostsRepository } from '@hookpost/nestjs-libraries/database/prisma/posts/posts.repository';
import { IntegrationManager } from '@hookpost/nestjs-libraries/integrations/integration.manager';
import { MediaService } from '@hookpost/nestjs-libraries/database/prisma/media/media.service';
import { MediaRepository } from '@hookpost/nestjs-libraries/database/prisma/media/media.repository';
import { NotificationsRepository } from '@hookpost/nestjs-libraries/database/prisma/notifications/notifications.repository';
import { EmailService } from '@hookpost/nestjs-libraries/services/email.service';
import { RazorpayService } from '@hookpost/nestjs-libraries/services/razorpay.service';
import { ExtractContentService } from '@hookpost/nestjs-libraries/openai/extract.content.service';
import { OpenaiService } from '@hookpost/nestjs-libraries/openai/openai.service';
import { AgenciesService } from '@hookpost/nestjs-libraries/database/prisma/agencies/agencies.service';
import { AgenciesRepository } from '@hookpost/nestjs-libraries/database/prisma/agencies/agencies.repository';
import { TrackService } from '@hookpost/nestjs-libraries/track/track.service';
import { ShortLinkService } from '@hookpost/nestjs-libraries/short-linking/short.link.service';
import { WebhooksRepository } from '@hookpost/nestjs-libraries/database/prisma/webhooks/webhooks.repository';
import { WebhooksService } from '@hookpost/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { SignatureRepository } from '@hookpost/nestjs-libraries/database/prisma/signatures/signature.repository';
import { SignatureService } from '@hookpost/nestjs-libraries/database/prisma/signatures/signature.service';
import { AutopostRepository } from '@hookpost/nestjs-libraries/database/prisma/autopost/autopost.repository';
import { AutopostService } from '@hookpost/nestjs-libraries/database/prisma/autopost/autopost.service';
import { SetsService } from '@hookpost/nestjs-libraries/database/prisma/sets/sets.service';
import { SetsRepository } from '@hookpost/nestjs-libraries/database/prisma/sets/sets.repository';
import { ThirdPartyRepository } from '@hookpost/nestjs-libraries/database/prisma/third-party/third-party.repository';
import { ThirdPartyService } from '@hookpost/nestjs-libraries/database/prisma/third-party/third-party.service';
import { VideoManager } from '@hookpost/nestjs-libraries/videos/video.manager';
import { FalService } from '@hookpost/nestjs-libraries/openai/fal.service';
import { RefreshIntegrationService } from '@hookpost/nestjs-libraries/integrations/refresh.integration.service';
import { OAuthRepository } from '@hookpost/nestjs-libraries/database/prisma/oauth/oauth.repository';
import { OAuthService } from '@hookpost/nestjs-libraries/database/prisma/oauth/oauth.service';
import { AnnouncementsRepository } from '@hookpost/nestjs-libraries/database/prisma/announcements/announcements.repository';
import { AnnouncementsService } from '@hookpost/nestjs-libraries/database/prisma/announcements/announcements.service';
import { ErrorsRepository } from '@hookpost/nestjs-libraries/database/prisma/errors/errors.repository';
import { ErrorsService } from '@hookpost/nestjs-libraries/database/prisma/errors/errors.service';
import { AdminStatsRepository } from '@hookpost/nestjs-libraries/database/prisma/admin-stats/admin-stats.repository';
import { AdminStatsService } from '@hookpost/nestjs-libraries/database/prisma/admin-stats/admin-stats.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    PrismaRepository,
    PrismaTransaction,
    UsersService,
    UsersRepository,
    OrganizationService,
    OrganizationRepository,
    SubscriptionService,
    SubscriptionRepository,
    NotificationService,
    NotificationsRepository,
    WebhooksRepository,
    WebhooksService,
    IntegrationService,
    IntegrationRepository,
    PostsService,
    PostsRepository,
    RazorpayService,
    SignatureRepository,
    AutopostRepository,
    AutopostService,
    SignatureService,
    MediaService,
    MediaRepository,
    AgenciesService,
    AgenciesRepository,
    IntegrationManager,
    RefreshIntegrationService,
    ExtractContentService,
    OpenaiService,
    FalService,
    EmailService,
    TrackService,
    ShortLinkService,
    SetsService,
    SetsRepository,
    ThirdPartyRepository,
    ThirdPartyService,
    OAuthRepository,
    OAuthService,
    VideoManager,
    AnnouncementsRepository,
    AnnouncementsService,
    ErrorsRepository,
    ErrorsService,
    AdminStatsRepository,
    AdminStatsService,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
