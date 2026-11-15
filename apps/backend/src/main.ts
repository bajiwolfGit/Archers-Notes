import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { JSON_BODY_LIMIT } from './posts/posts.constants.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Frontend is now 3000
  app.enableCors({origin: "http://localhost:3000", credentials: true, });

  // Post files arrive as base64 inside the JSON body, which is far larger
  // than Express's default 100kb limit.
  app.useBodyParser('json', { limit: JSON_BODY_LIMIT });

  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true, }), );

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
