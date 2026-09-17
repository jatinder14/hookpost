import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SubscriptionRepository } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { IntegrationRepository } from '@hookpost/nestjs-libraries/database/prisma/integrations/integration.repository';
import { IntegrationManager } from '@hookpost/nestjs-libraries/integrations/integration.manager';
import {
  AnalyticsData,
  SocialProvider,
} from '@hookpost/nestjs-libraries/integrations/social/social.integrations.interface';
import { Integration, Organization } from '@prisma/client';
import { NotificationService } from '@hookpost/nestjs-libraries/database/prisma/notifications/notification.service';
import dayjs from 'dayjs';
import { timer } from '@hookpost/helpers/utils/timer';
import { ioRedis } from '@hookpost/nestjs-libraries/redis/redis.service';
import {
  NotEnoughScopes,
  RefreshToken,
} from '@hookpost/nestjs-libraries/integrations/social.abstract';
import { IntegrationTimeDto } from '@hookpost/nestjs-libraries/dtos/integrations/integration.time.dto';
import { UploadFactory } from '@hookpost/nestjs-libraries/upload/upload.factory';
import { PlugDto } from '@hookpost/nestjs-libraries/dtos/plugs/plug.dto';
import { difference, uniq } from 'lodash';
import utc from 'dayjs/plugin/utc';
import { AutopostRepository } from '@hookpost/nestjs-libraries/database/prisma/autopost/autopost.repository';
import { RefreshIntegrationService } from '@hookpost/nestjs-libraries/integrations/refresh.integration.service';
import { TemporalService } from 'nestjs-temporal-core';

dayjs.extend(utc);

@Injectable()
export class IntegrationService {
  private storage = UploadFactory.createStorage();
  constructor(
    private _integrationRepository: IntegrationRepository,
    private _autopostsRepository: AutopostRepository,
    private _integrationManager: IntegrationManager,
    private _notificationService: NotificationService,
    @Inject(forwardRef(() => RefreshIntegrationService))
    private _refreshIntegrationService: RefreshIntegrationService,
    private _temporalService: TemporalService,
    // Repository, not SubscriptionService: SubscriptionService imports
    // IntegrationService, so injecting it here would be a dependency cycle.
    private _subscriptionRepository: SubscriptionRepository
  ) {}

  async changeActiveCron(orgId: string) {
    const data = await this._autopostsRepository.getAutoposts(orgId);

    for (const item of data.filter((f) => f.active)) {
      try {
        await this._temporalService.terminateWorkflow(`autopost-${item.id}`);
      } catch (err) {}
    }

    return true;
  }

  getMentions(platform: string, q: string) {
    return this._integrationRepository.getMentions(platform, q);
  }

  insertMentions(
    platform: string,
    mentions: { name: string; username: string; image: string }[]
  ) {
    return this._integrationRepository.insertMentions(platform, mentions);
  }

  async setTimes(
    orgId: string,
    integrationId: string,
    times: IntegrationTimeDto
  ) {
    return this._integrationRepository.setTimes(orgId, integrationId, times);
  }

  updateProviderSettings(org: string, id: string, additionalSettings: string) {
    return this._integrationRepository.updateProviderSettings(
      org,
      id,
      additionalSettings
    );
  }

  checkPreviousConnections(org: string, id: string) {
    return this._integrationRepository.checkPreviousConnections(org, id);
  }

  async createOrUpdateIntegration(
    additionalSettings:
      | {
          title: string;
          description: string;
          type: 'checkbox' | 'text' | 'textarea';
          value: any;
          regex?: string;
        }[]
      | undefined,
    oneTimeToken: boolean,
    org: string,
    name: string,
    picture: string | undefined,
    type: 'article' | 'social',
    internalId: string,
    provider: string,
    token: string,
    refreshToken = '',
    expiresIn?: number,
    username?: string,
    isBetweenSteps = false,
    refresh?: string,
    timezone?: number,
    customInstanceDetails?: string
  ) {
    const uploadedPicture = picture
      ? picture?.indexOf('imagedelivery.net') > -1
        ? picture
        : await this.storage.uploadSimple(picture).catch((err) => {
            console.log('Failed to upload profile picture:', picture, err);
            return undefined;
          })
      : undefined;

    return this._integrationRepository.createOrUpdateIntegration(
      additionalSettings,
      oneTimeToken,
      org,
      name,
      uploadedPicture,
      type,
      internalId,
      provider,
      token,
      refreshToken,
      expiresIn,
      username,
      isBetweenSteps,
      refresh,
      timezone,
      customInstanceDetails
    );
  }

  updateIntegrationGroup(org: string, id: string, group: string) {
    return this._integrationRepository.updateIntegrationGroup(org, id, group);
  }

  updateOnCustomerName(org: string, id: string, name: string) {
    return this._integrationRepository.updateOnCustomerName(org, id, name);
  }

  getIntegrationsList(org: string) {
    return this._integrationRepository.getIntegrationsList(org);
  }

  getIntegrationForOrder(id: string, order: string, user: string, org: string) {
    return this._integrationRepository.getIntegrationForOrder(
      id,
      order,
      user,
      org
    );
  }

  updateNameAndUrl(id: string, name: string, url: string) {
    return this._integrationRepository.updateNameAndUrl(id, name, url);
  }

  getIntegrationById(org: string, id: string) {
    return this._integrationRepository.getIntegrationById(org, id);
  }

  async refreshToken(provider: SocialProvider, refresh: string) {
    try {
      const { refreshToken, accessToken, expiresIn } =
        await provider.refreshToken(refresh);

      if (!refreshToken || !accessToken || !expiresIn) {
        return false;
      }

      return { refreshToken, accessToken, expiresIn };
    } catch (e) {
      return false;
    }
  }

  async disconnectChannel(orgId: string, integration: Integration, err = '') {
    await this._integrationRepository.disconnectChannel(orgId, integration.id);
    await this.informAboutRefreshError(orgId, integration, err);
  }

  // A reconnect that came back from a different provider (MIGRATE_PROVIDERS):
  // match the disconnected channel by profile and move it to the new provider
  // in place, so scheduled posts, settings and customers survive. Throws the
  // same error as a mismatched reconnect when the migration is not configured
  // or the user connected a different account.
  async migrateIntegration(
    org: string,
    oldInternalId: string,
    newProvider: string,
    auth: { id: string; username: string }
  ) {
    const existing = await this._integrationRepository.getIntegrationByInternalId(
      org,
      oldInternalId
    );

    if (
      !existing ||
      this._integrationManager.getMigrationTarget(
        existing.providerIdentifier
      ) !== newProvider
    ) {
      throw new NotEnoughScopes(
        'Please refresh the channel that needs to be refreshed'
      );
    }

    const oldProvider = this._integrationManager.getSocialIntegration(
      existing.providerIdentifier
    );

    if (!oldProvider.migrationMatch(auth, existing)) {
      throw new NotEnoughScopes(
        `Please connect the same account (@${existing.profile}) that needs to be refreshed`
      );
    }

    if (
      await this._integrationRepository.getIntegrationByInternalId(org, auth.id)
    ) {
      throw new NotEnoughScopes(
        'This account is already connected as another channel, please delete one of them first'
      );
    }

    return this._integrationRepository.migrateIntegration(
      org,
      existing.id,
      auth.id,
      newProvider,
      existing.rootInternalId === existing.internalId
        ? auth.id
        : existing.rootInternalId
    );
  }

  // A fresh connect of a migration target (MIGRATE_PROVIDERS) for an account
  // the org already has on the source provider: adopt that channel instead of
  // creating a confusing duplicate - the channel is migrated in place exactly
  // like a reconnect, and the follow-up upsert stores the fresh tokens. A no-op
  // when nothing matches, so a genuinely new account still creates a channel.
  async migrateIntegrationOnConnect(
    org: string,
    newProvider: string,
    auth: { id: string; username: string }
  ) {
    const sources = this._integrationManager.getMigrationSources(newProvider);
    if (
      !sources.length ||
      this._integrationManager.getSocialIntegration(newProvider).isBetweenSteps
    ) {
      return;
    }

    // the account already exists on the new provider: the normal upsert
    // updates it, nothing to adopt
    if (
      await this._integrationRepository.getIntegrationByInternalId(org, auth.id)
    ) {
      return;
    }

    const existing = (
      await this._integrationRepository.getIntegrationsList(org)
    ).find(
      (p) =>
        sources.includes(p.providerIdentifier) &&
        this._integrationManager
          .getSocialIntegration(p.providerIdentifier)
          .migrationMatch(auth, p)
    );

    if (!existing) {
      return;
    }

    return this._integrationRepository.migrateIntegration(
      org,
      existing.id,
      auth.id,
      newProvider,
      existing.rootInternalId === existing.internalId
        ? auth.id
        : existing.rootInternalId
    );
  }

  async informAboutRefreshError(
    orgId: string,
    integration: Integration,
    err = ''
  ) {
    await this._notificationService.inAppNotification(
      orgId,
      `Could not refresh your ${integration.providerIdentifier} channel ${err}`,
      `Could not refresh your ${integration.providerIdentifier} channel ${err}. Please go back to the system and connect it again ${process.env.FRONTEND_URL}/launches`,
      true,
      false,
      'info'
    );
  }

  async refreshNeeded(org: string, id: string) {
    return this._integrationRepository.refreshNeeded(org, id);
  }

  async setBetweenRefreshSteps(id: string) {
    return this._integrationRepository.setBetweenRefreshSteps(id);
  }

  async refreshTokens() {
    const integrations = await this._integrationRepository.needsToBeRefreshed();
    for (const integration of integrations) {
      const provider = this._integrationManager.getSocialIntegration(
        integration.providerIdentifier
      );

      const data = await this.refreshToken(provider, integration.refreshToken!);

      if (!data) {
        await this.informAboutRefreshError(
          integration.organizationId,
          integration
        );
        await this._integrationRepository.refreshNeeded(
          integration.organizationId,
          integration.id
        );
        return;
      }

      const { refreshToken, accessToken, expiresIn } = data;

      await this.createOrUpdateIntegration(
        undefined,
        !!provider.oneTimeToken,
        integration.organizationId,
        integration.name,
        undefined,
        'social',
        integration.internalId,
        integration.providerIdentifier,
        accessToken,
        refreshToken,
        expiresIn
      );
    }
  }

  async disableChannel(org: string, id: string) {
    return this._integrationRepository.disableChannel(org, id);
  }

  async enableChannel(org: string, totalChannels: number, id: string) {
    const integrations = (
      await this._integrationRepository.getIntegrationsList(org)
    ).filter((f) => !f.disabled);
    if (
      !!process.env.RAZORPAY_KEY_ID &&
      integrations.length >= totalChannels
    ) {
      throw new Error('You have reached the maximum number of channels');
    }

    return this._integrationRepository.enableChannel(org, id);
  }

  async getPostsForChannel(org: string, id: string) {
    return this._integrationRepository.getPostsForChannel(org, id);
  }

  async deleteChannel(org: string, id: string) {
    return this._integrationRepository.deleteChannel(org, id);
  }

  async disableIntegrations(org: string, totalChannels: number) {
    return this._integrationRepository.disableIntegrations(org, totalChannels);
  }

  async checkForDeletedOnceAndUpdate(org: string, page: string) {
    return this._integrationRepository.checkForDeletedOnceAndUpdate(org, page);
  }

  async saveProviderPage(org: string, id: string, data: any) {
    const getIntegration = await this._integrationRepository.getIntegrationById(
      org,
      id
    );
    if (!getIntegration) {
      throw new HttpException('Integration not found', HttpStatus.NOT_FOUND);
    }
    if (!getIntegration.inBetweenSteps) {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }

    const provider = this._integrationManager.getSocialIntegration(
      getIntegration.providerIdentifier
    );

    if (!provider.fetchPageInformation) {
      throw new HttpException(
        'Provider does not support page selection',
        HttpStatus.BAD_REQUEST
      );
    }

    // Support both single selection and multi-selection (batch)
    const itemsToSave: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.pages)
      ? data.pages
      : [data];

    if (!itemsToSave.length) {
      throw new HttpException('No pages selected', HttpStatus.BAD_REQUEST);
    }

    // The @CheckPolicies guard asks "is there room for ONE more channel?" once,
    // at request time (permissions.service.ts:83-93). That was sound while one
    // request created one channel. A batch creates N, so a Free org with one
    // channel and an allowance of two passed the guard and could then create
    // twenty. The public route below has no policy guard at all, so it never
    // even got that check. Enforce the real remaining allowance here, where the
    // creation actually happens and both routes pass through.
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(org);
    const allowance =
      subscription?.totalChannels ?? pricing.FREE.channel;
    const used = (await this.getIntegrationsList(org)).filter(
      (i) => !i.refreshNeeded
    ).length;
    const remaining = Math.max(0, allowance - used);

    if (itemsToSave.length > remaining) {
      // Reject rather than silently connecting the first `remaining` of them.
      // Quietly saving 2 of the 20 pages someone selected is the same kind of
      // lie as reporting a count that never happened.
      throw new HttpException(
        `Your plan allows ${allowance} channels and ${used} are in use, so you can add ${remaining} more. You selected ${itemsToSave.length}.`,
        HttpStatus.PAYMENT_REQUIRED
      );
    }

    const [firstItem, ...restItems] = itemsToSave;

    const getIntegrationInformation = await provider.fetchPageInformation(
      getIntegration.token,
      firstItem
    );

    await this.checkForDeletedOnceAndUpdate(
      org,
      String(getIntegrationInformation.id)
    );
    await this._integrationRepository.updateIntegration(id, {
      picture: getIntegrationInformation.picture,
      internalId: String(getIntegrationInformation.id),
      organizationId: org,
      name: getIntegrationInformation.name,
      inBetweenSteps: false,
      token: getIntegrationInformation.access_token,
      profile: getIntegrationInformation.username,
    });

    // firstItem above is already saved at this point.
    let saved = 1;
    const failed: string[] = [];

    for (const item of restItems) {
      try {
        const itemInfo = await provider.fetchPageInformation(
          getIntegration.token,
          item
        );

        await this.checkForDeletedOnceAndUpdate(
          org,
          String(itemInfo.id)
        );

        await this.createOrUpdateIntegration(
          getIntegration.additionalSettings
            ? JSON.parse(getIntegration.additionalSettings)
            : undefined,
          false,
          org,
          itemInfo.name,
          itemInfo.picture,
          getIntegration.type as 'article' | 'social',
          String(itemInfo.id),
          getIntegration.providerIdentifier,
          itemInfo.access_token,
          getIntegration.refreshToken,
          getIntegration.tokenExpiration
            ? Math.floor(
                (new Date(getIntegration.tokenExpiration).getTime() -
                  Date.now()) /
                  1000
              )
            : undefined,
          itemInfo.username,
          false,
          undefined,
          undefined
        );
        saved++;
      } catch (err) {
        // firstItem is processed outside this loop, so its failure propagates
        // and the request errors; items 2..N used to fail silently while the
        // response still claimed every one succeeded. Report them instead.
        failed.push(String((item as any)?.page ?? (item as any)?.id ?? 'unknown'));
        console.error('Failed saving additional provider item:', item, err);
      }
    }

    return { success: failed.length === 0, count: saved, failed };
  }

  async checkAnalytics(
    org: Organization,
    integration: string,
    date: string,
    forceRefresh = false
  ): Promise<AnalyticsData[]> {
    const getIntegration = await this.getIntegrationById(org.id, integration);

    if (!getIntegration) {
      throw new Error('Invalid integration');
    }

    if (getIntegration.type !== 'social') {
      return [];
    }

    const integrationProvider = this._integrationManager.getSocialIntegration(
      getIntegration.providerIdentifier
    );

    if (
      dayjs(getIntegration?.tokenExpiration).isBefore(dayjs()) ||
      forceRefresh
    ) {
      const data = await this._refreshIntegrationService.refresh(
        getIntegration
      );
      if (!data) {
        return [];
      }

      const { accessToken } = data;

      if (accessToken) {
        getIntegration.token = accessToken;

        if (integrationProvider.refreshWait) {
          await timer(10000);
        }
      } else {
        await this.disconnectChannel(org.id, getIntegration);
        return [];
      }
    }

    const getIntegrationData = await ioRedis.get(
      `integration:${org.id}:${integration}:${date}`
    );
    if (getIntegrationData) {
      return JSON.parse(getIntegrationData);
    }

    if (integrationProvider.analytics) {
      try {
        const loadAnalytics = await integrationProvider.analytics(
          getIntegration.internalId,
          getIntegration.token,
          +date
        );
        await ioRedis.set(
          `integration:${org.id}:${integration}:${date}`,
          JSON.stringify(loadAnalytics),
          'EX',
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? 1
            : 3600
        );
        return loadAnalytics;
      } catch (e) {
        if (e instanceof RefreshToken) {
          return this.checkAnalytics(org, integration, date, true);
        }
      }
    }

    return [];
  }

  customers(orgId: string) {
    return this._integrationRepository.customers(orgId);
  }

  getPlugsByIntegrationId(org: string, integrationId: string) {
    return this._integrationRepository.getPlugsByIntegrationId(
      org,
      integrationId
    );
  }

  async processInternalPlug(
    data: {
      post: string;
      originalIntegration: string;
      integration: string;
      plugName: string;
      orgId: string;
      delay: number;
      information: any;
    },
    forceRefresh = false
  ): Promise<any> {
    const originalIntegration =
      await this._integrationRepository.getIntegrationById(
        data.orgId,
        data.originalIntegration
      );

    const getIntegration = await this._integrationRepository.getIntegrationById(
      data.orgId,
      data.integration
    );

    if (!getIntegration || !originalIntegration) {
      return;
    }

    const getAllInternalPlugs = this._integrationManager
      .getInternalPlugs(getIntegration.providerIdentifier)
      .internalPlugs.find((p: any) => p.identifier === data.plugName);

    if (!getAllInternalPlugs) {
      return;
    }

    const getSocialIntegration = this._integrationManager.getSocialIntegration(
      getIntegration.providerIdentifier
    );

    // @ts-ignore
    await getSocialIntegration?.[getAllInternalPlugs.methodName]?.(
      getIntegration,
      originalIntegration,
      data.post,
      data.information
    );

    return;
  }

  async processPlugs(data: {
    plugId: string;
    postId: string;
    delay: number;
    totalRuns: number;
    currentRun: number;
  }) {
    const getPlugById = await this._integrationRepository.getPlug(data.plugId);
    if (!getPlugById) {
      return true;
    }

    const integration = this._integrationManager.getSocialIntegration(
      getPlugById.integration.providerIdentifier
    );

    // @ts-ignore
    const process = await integration[getPlugById.plugFunction](
      getPlugById.integration,
      data.postId,
      JSON.parse(getPlugById.data).reduce((all: any, current: any) => {
        all[current.name] = current.value;
        return all;
      }, {})
    );

    if (process) {
      return true;
    }

    if (data.totalRuns === data.currentRun) {
      return true;
    }

    return false;
  }

  async createOrUpdatePlug(
    orgId: string,
    integrationId: string,
    body: PlugDto
  ) {
    const { activated } = await this._integrationRepository.createOrUpdatePlug(
      orgId,
      integrationId,
      body
    );

    return {
      activated,
    };
  }

  async changePlugActivation(orgId: string, plugId: string, status: boolean) {
    const { id, integrationId, plugFunction } =
      await this._integrationRepository.changePlugActivation(
        orgId,
        plugId,
        status
      );

    return { id };
  }

  async getPlugs(orgId: string, integrationId: string) {
    return this._integrationRepository.getPlugs(orgId, integrationId);
  }

  async loadExisingData(
    methodName: string,
    integrationId: string,
    id: string[]
  ) {
    const exisingData = await this._integrationRepository.loadExisingData(
      methodName,
      integrationId,
      id
    );
    const loadOnlyIds = exisingData.map((p) => p.value);
    return difference(id, loadOnlyIds);
  }

  async findFreeDateTime(
    orgId: string,
    integrationsId?: string
  ): Promise<number[]> {
    const findTimes = await this._integrationRepository.getPostingTimes(
      orgId,
      integrationsId
    );
    return uniq(
      findTimes.reduce((all: any, current: any) => {
        return [
          ...all,
          ...JSON.parse(current.postingTimes).map(
            (p: { time: number }) => p.time
          ),
        ];
      }, [] as number[])
    );
  }
}
