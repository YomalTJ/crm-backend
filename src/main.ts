import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Note: Migrations are handled by the build process (prebuild script)
  // No need to run migrations here as they're already executed

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://54.206.38.94:3000',
      'https://crm-frontend-black.vercel.app',
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
