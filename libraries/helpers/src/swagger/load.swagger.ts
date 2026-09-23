import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

// Not mounted in production unless ENABLE_SWAGGER=true.
//
// This served a full Swagger UI and a 50KB OpenAPI spec at /api/docs to anyone:
// 196 internal endpoints, including /admin/users/{id}/super-admin,
// /billing/refund-charges and /billing/chatbase-refund. The routes themselves
// are guarded - checked 2026-09-23, anonymous gets 401 and a non-admin account
// gets "Unauthorized" on every /admin route - so this was a map, not a door.
// But a map of every admin and billing route is the first thing anyone probing
// the API wants, and nothing links to it: the customer-facing API docs are the
// /docs/public-api marketing page, which covers /public/v1 only.
export const loadSwagger = (app: INestApplication) => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ENABLE_SWAGGER !== 'true'
  ) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Hookpost Swagger file')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
