import {
  Global,
  Injectable,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { TemporalService } from 'nestjs-temporal-core';

/**
 * Arms missingPostWorkflow: the hourly sweep that re-queues a QUEUE post whose
 * Temporal workflow no longer exists (see missing.post.workflow.ts, which calls
 * searchForMissingThreeHoursPosts over a two-day window).
 *
 * This is the only thing that starts that sweep, and both of its failure modes
 * used to be silent:
 *
 *   - `RUN_CRON` was never set in the production .env, so the branch below
 *     simply did not run. Discovered 2026-09-10: the sweep had never executed
 *     in production once, and `temporal workflow list` showed no
 *     missingPostWorkflow at all. Nothing said so anywhere.
 *   - the start was wrapped in `catch (err) {}`, so even with RUN_CRON set a
 *     failure to arm it left no trace.
 *
 * A safety net whose absence is invisible is not a safety net, so both cases
 * now log.
 */
@Injectable()
export class InfiniteWorkflowRegister implements OnModuleInit {
  constructor(private _temporalService: TemporalService) {}

  async onModuleInit(): Promise<void> {
    if (!process.env.RUN_CRON) {
      Logger.warn(
        'RUN_CRON is not set: missingPostWorkflow will not run, so a post whose Temporal workflow is lost will never be re-queued',
        'InfiniteWorkflowRegister'
      );
      return;
    }

    try {
      await this._temporalService.client
        ?.getRawClient()
        ?.workflow?.start('missingPostWorkflow', {
          workflowId: 'missing-post-workflow',
          taskQueue: 'main',
        });
      Logger.log(
        'missingPostWorkflow started',
        'InfiniteWorkflowRegister'
      );
    } catch (err) {
      // Restarting the backend hits this every time, because the workflow is
      // already running from the previous boot. That is the normal case and is
      // not worth an error.
      const message = String((err as Error)?.message ?? err);
      if (/already started|AlreadyStarted|already exists/i.test(message)) {
        Logger.log(
          'missingPostWorkflow already running',
          'InfiniteWorkflowRegister'
        );
      } else {
        Logger.error(
          `could not start missingPostWorkflow - overdue posts will NOT be re-queued: ${message}`,
          'InfiniteWorkflowRegister'
        );
      }
    }
  }
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [InfiniteWorkflowRegister],
  get exports() {
    return this.providers;
  },
})
export class InfiniteWorkflowRegisterModule {}
