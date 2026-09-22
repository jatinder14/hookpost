import { Module } from '@nestjs/common';
import { PostActivity } from '@hookpost/orchestrator/activities/post.activity';
import { getTemporalModule } from '@hookpost/nestjs-libraries/temporal/temporal.module';
import { DatabaseModule } from '@hookpost/nestjs-libraries/database/prisma/database.module';
import { AutopostService } from '@hookpost/nestjs-libraries/database/prisma/autopost/autopost.service';
import { EmailActivity } from '@hookpost/orchestrator/activities/email.activity';
import { IntegrationsActivity } from '@hookpost/orchestrator/activities/integrations.activity';
import { VideoActivity } from '@hookpost/orchestrator/activities/video.activity';
import { MediaActivity } from '@hookpost/orchestrator/activities/media.activity';
import { ClippingActivity } from '@hookpost/orchestrator/activities/clipping.activity';
import { VideoModule } from '@hookpost/nestjs-libraries/videos/video.module';
import { HealthController } from '@hookpost/orchestrator/health.controller';

const activities = [
  PostActivity,
  AutopostService,
  EmailActivity,
  IntegrationsActivity,
  VideoActivity,
  MediaActivity,
  ClippingActivity,
];
@Module({
  imports: [
    DatabaseModule,
    VideoModule,
    getTemporalModule(true, require.resolve('./workflows'), activities),
  ],
  controllers: [HealthController],
  providers: [...activities],
  get exports() {
    return [...this.providers, ...this.imports];
  },
})
export class AppModule {}
