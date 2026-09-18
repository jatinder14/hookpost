import {
  Logger,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Query,
  Param,
} from '@nestjs/common';
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { GetOrgFromRequest } from '@hookpost/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { SubscriptionService } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { MastraAgent } from '@ag-ui/mastra';
import { MastraService } from '@hookpost/nestjs-libraries/chat/mastra.service';
import { Request, Response } from 'express';
import { RequestContext } from '@mastra/core/di';
import { CheckPolicies } from '@hookpost/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections, SubscriptionException } from '@hookpost/backend/services/auth/permissions/permission.exception.class';

export type ChannelsContext = {
  integrations: string;
  organization: string;
  ui: string;
};

@Controller('/copilot')
export class CopilotController {
  constructor(
    private _subscriptionService: SubscriptionService,
    private _mastraService: MastraService
  ) {}
  @Post('/chat')
  async chatAgent(
    @GetOrgFromRequest() organization: Organization,
    @Req() req: Request,
    @Res() res: Response
  ) {
    if (
      process.env.OPENAI_API_KEY === undefined ||
      process.env.OPENAI_API_KEY === ''
    ) {
      Logger.warn('OpenAI API key not set, chat functionality will not work');
      return;
    }

    // CopilotKit talks to this one URL for everything, including the handshake
    // it fires on EVERY app page load - it is mounted around the whole layout
    // in new-layout/layout.component.tsx. Charging a credit for that had two
    // consequences, both bad:
    //
    //   1. Opening the calendar spent an AI credit even if nobody typed.
    //   2. Once the allowance hit zero - immediately, on FREE, which has
    //      ai_generation_count: 0 - the handshake 402'd, CopilotKit errored,
    //      and since it wraps the entire layout the channels sidebar and the
    //      Create Post button never rendered. The calendar just span forever
    //      while the database had 17 healthy channels.
    //
    // Only a real generation is billable. CopilotKit's GraphQL operation for
    // that is generateCopilotResponse; availableAgents and loadAgentState are
    // discovery calls that must stay free and must never 402, or the app is
    // unusable for anyone without an AI quota.
    const operation = (req.body as any)?.operationName;
    if (operation === 'generateCopilotResponse') {
      await this.consumeTextCredit(organization);
    }

    const copilotRuntimeHandler = copilotRuntimeNodeHttpEndpoint({
      endpoint: '/copilot/chat',
      runtime: new CopilotRuntime(),
      serviceAdapter: new OpenAIAdapter({
        model: process.env.OPENAI_TEXT_MODEL || 'gpt-4.1-mini',
      }),
    });

    return copilotRuntimeHandler(req, res);
  }

  // Records one AI-text credit, or refuses when the plan's monthly allowance
  // is spent. Throwing SubscriptionException matches how the image and video
  // quotas already report themselves to the frontend.
  private async consumeTextCredit(organization: Organization) {
    const { credits } = await this._subscriptionService.checkCredits(
      organization,
      'ai_text'
    );

    if (credits <= 0) {
      throw new SubscriptionException({
        action: AuthorizationActions.Create,
        section: Sections.AI_GENERATIONS,
      });
    }

    await this._subscriptionService.useCredit(organization, 'ai_text', async () =>
      true
    );
  }

  @Post('/agent')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async agent(
    @Req() req: Request,
    @Res() res: Response,
    @GetOrgFromRequest() organization: Organization
  ) {
    if (
      process.env.OPENAI_API_KEY === undefined ||
      process.env.OPENAI_API_KEY === ''
    ) {
      Logger.warn('OpenAI API key not set, chat functionality will not work');
      return;
    }

    // Sections.AI above is only a boolean feature flag, so it lets a plan use
    // the agent but does not bound how much. The credit meter does.
    await this.consumeTextCredit(organization);

    const mastra = await this._mastraService.mastra();
    const requestContext = new RequestContext<ChannelsContext>();
    requestContext.set(
      'integrations',
      req?.body?.variables?.properties?.integrations || []
    );

    requestContext.set('organization', JSON.stringify(organization));
    requestContext.set('ui', 'true');

    const agents = MastraAgent.getLocalAgents({
      resourceId: organization.id,
      mastra,
      requestContext: requestContext as any,
    });

    const runtime = new CopilotRuntime({
      agents,
    });

    const copilotRuntimeHandler = copilotRuntimeNextJSAppRouterEndpoint({
      endpoint: '/copilot/agent',
      runtime,
      // properties: req.body.variables.properties,
      serviceAdapter: new OpenAIAdapter({
        model: process.env.OPENAI_TEXT_MODEL || 'gpt-4.1-mini',
      }),
    });

    return copilotRuntimeHandler.handleRequest(req, res);
  }

  @Get('/credits')
  calculateCredits(
    @GetOrgFromRequest() organization: Organization,
    @Query('type') type: 'ai_images' | 'ai_videos' | 'ai_text'
  ) {
    return this._subscriptionService.checkCredits(
      organization,
      type || 'ai_images'
    );
  }

  @Get('/:thread/list')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async getMessagesList(
    @GetOrgFromRequest() organization: Organization,
    @Param('thread') threadId: string
  ): Promise<any> {
    const mastra = await this._mastraService.mastra();
    const memory = await mastra.getAgent('hookpost').getMemory();
    try {
      return await memory.recall({
        resourceId: organization.id,
        threadId,
      });
    } catch (err) {
      Logger.warn(`Could not recall messages for thread ${threadId}: ${err}`);
      return { messages: [] };
    }
  }

  @Get('/list')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async getList(@GetOrgFromRequest() organization: Organization) {
    const mastra = await this._mastraService.mastra();
    const memory = await mastra.getAgent('hookpost').getMemory();
    const list = await memory.listThreads({
      filter: { resourceId: organization.id },
      perPage: 100000,
      page: 0,
      orderBy: { field: 'createdAt', direction: 'DESC' },
    });

    return {
      threads: list.threads.map((p) => ({
        id: p.id,
        title: p.title,
      })),
    };
  }
}
