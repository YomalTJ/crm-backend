import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'samurdhi',
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: ['error', 'warn'],
  charset: 'utf8mb4',
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export default dataSource;
