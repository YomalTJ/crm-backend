import 'dotenv/config';
import { DataSource } from 'typeorm';
import { resolve } from 'path';

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'samurdhi',
  entities: [resolve(process.cwd(), 'src/entities/**/*.ts')],
  migrations: [resolve(process.cwd(), 'src/migrations/**/*.ts')],
  synchronize: false,
  logging: false,
  charset: 'utf8mb4', // Add this line
  extra: {
    charset: 'utf8mb4_unicode_ci', // Add this line
  },
});