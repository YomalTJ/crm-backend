import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

export const type = 'mysql';
export const host = configService.get('DB_HOST');
export const port = configService.get('DB_PORT');
export const username = configService.get('DB_USERNAME');
export const password = configService.get('DB_PASSWORD');
export const database = configService.get('DB_NAME');
export const entities = ['dist/**/*.entity{.ts,.js}'];
export const migrations = ['dist/migrations/*{.ts,.js}'];
export const cli = {
  migrationsDir: 'src/migrations',
};
export const synchronize = false;
