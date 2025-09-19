import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';

async function bootstrap() {
  await runMigrations();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000', 'http://54.206.38.94:3000', 'https://crm-frontend-black.vercel.app'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}

async function runMigrations() {
  try {
    console.log('Checking for database migrations...');

    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'samurdhi',
      entities: ['dist/**/*.entity{.js,.ts}'],
      migrations: ['dist/migrations/*{.js,.ts}'],
      synchronize: false,
    });

    await dataSource.initialize();

    const executed = await dataSource.runMigrations();
    if (executed.length > 0) {
      console.log(`✅ Executed ${executed.length} migration(s)`);
    } else {
      console.log('✅ Database is up to date');
    }

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error; // Stop the application if migrations fail
  }
}

bootstrap();
