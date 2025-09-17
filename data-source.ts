import 'dotenv/config';
import { DataSource } from 'typeorm';
import { resolve } from 'path';

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

// Check if we're running in development (src) or production (dist)
const isDevelopment = process.env.NODE_ENV !== 'production';
const entitiesPath = isDevelopment
  ? 'src/**/*.entity{.ts,.js}'
  : 'dist/**/*.entity{.js,.ts}';
const migrationsPath = isDevelopment
  ? 'src/migrations/*{.ts,.js}'
  : 'dist/migrations/*{.js,.ts}';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'samurdhi',
  entities: [resolve(process.cwd(), entitiesPath)],
  migrations: [resolve(process.cwd(), migrationsPath)],
  synchronize: false,
  logging: false,
  charset: 'utf8mb4', // Add this line
  extra: {
    charset: 'utf8mb4_unicode_ci', // Add this line
  },
});
