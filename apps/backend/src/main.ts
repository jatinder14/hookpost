// MUST be the first import. Loads .env into process.env before any other
// module body runs - import declarations execute in order, so anything below
// this line already sees the file's values.
//
// PM2 runs the compiled main.js directly (`interpreter: node`), which bypasses
// the package.json "start" script and its `dotenv -e ../../.env`. So in
// production the backend's entire configuration existed only as the environment
// PM2 happened to capture whenever someone last started it by hand. That is a
// live hazard: `pm2 restart --update-env` from a shell without those variables
// replaces the process environment wholesale, and doing exactly that on
// 2026-09-10 dropped the backend from 92 env keys to 22 - DATABASE_URL,
// REDIS_URL and JWT_SECRET among them - and took port 3000 down. The deploy
// script survives only because `pm2 reload --update-env` preserves the saved
// env where `restart` does not, and nothing in deploy.sh sources .env at all.
//
// Reading the file here removes the distinction and the whole class of failure.
// dotenv does not override variables already present, so anything PM2 or CI
// supplies still wins and no existing behaviour changes.
//
// Path is process.cwd()/.env; ops/ecosystem.config.js pins cwd to the repo root.
import 'dotenv/config';

import { initializeSentry } from '@hookpost/nestjs-libraries/sentry/initialize.sentry';
initializeSentry('backend', true);
import compression from 'compression';

import { loadSwagger } from '@hookpost/helpers/swagger/load.swagger';
import { json } from 'express';
import { Runtime } from '@temporalio/worker';
Runtime.install({ shutdownSignals: [] });

process.env.TZ = 'UTC';

import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SubscriptionExceptionFilter } from '@hookpost/backend/services/auth/permissions/subscription.exception';
import { PostValidationExceptionFilter } from '@hookpost/backend/api/routes/posts.validation.exception';
import { HttpExceptionFilter } from '@hookpost/nestjs-libraries/services/exception.filter';
import { ConfigurationChecker } from '@hookpost/helpers/configuration/configuration.checker';
import { startMcp } from '@hookpost/nestjs-libraries/chat/start.mcp';

async function start() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: {
      ...(!process.env.NOT_SECURED ? { credentials: true } : {}),
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'auth',
        'showorg',
        'impersonate',
        'x-copilotkit-runtime-client-gql-version',
      ],
      exposedHeaders: [
        'reload',
        'onboarding',
        'activate',
        'x-copilotkit-runtime-client-gql-version',
        ...(process.env.NOT_SECURED ? ['auth', 'showorg', 'impersonate'] : []),
      ],
      origin: [
        process.env.FRONTEND_URL,
        'http://localhost:6274',
        ...(process.env.MAIN_URL ? [process.env.MAIN_URL] : []),
      ],
    },
  });

  await startMcp(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.use(['/copilot/{*splat}', '/posts'], (req: any, res: any, next: any) => {
    json({ limit: '50mb' })(req, res, next);
  });

  app.use(cookieParser());
  app.use(compression());
  app.useGlobalFilters(new SubscriptionExceptionFilter());
  app.useGlobalFilters(new PostValidationExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  loadSwagger(app);

  const port = process.env.PORT || 3000;

  try {
    await app.listen(port);
    console.log('Backend started successfully on port ' + port);

    checkConfiguration(); // Do this last, so that users will see obvious issues at the end of the startup log without having to scroll up.

    Logger.log(`🚀 Backend is running on: http://localhost:${port}`);
  } catch (e) {
    Logger.error(`Backend failed to start on port ${port}`, e);
  }
}

function checkConfiguration() {
  const checker = new ConfigurationChecker();
  checker.readEnvFromProcess();
  checker.check();

  if (checker.hasIssues()) {
    for (const issue of checker.getIssues()) {
      Logger.warn(issue, 'Configuration issue');
    }

    Logger.warn('Configuration issues found: ' + checker.getIssuesCount());
  } else {
    Logger.log('Configuration check completed without any issues');
  }
}

start();
