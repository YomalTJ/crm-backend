import 'dotenv/config';
import 'tsconfig-paths/register';
import dataSource from '../data-source';
import { readdirSync } from 'fs';
import { join } from 'path';

interface MigrationInfo {
  name: string;
  file: string;
}

async function showPendingMigrations() {
  try {
    console.log('📋 Checking migration status...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('');

    await dataSource.initialize();

    // Ensure migrations table exists
    const migrationTableExists = await dataSource.query(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'migrations'`,
    );

    if (migrationTableExists[0].count === 0) {
      console.log('⚠️  Migrations table does not exist');
      console.log('   Run migrations to create it');
      await dataSource.destroy();
      process.exit(0);
    }

    // Get executed migrations
    const executedMigrations = await dataSource.query(
      'SELECT name, timestamp FROM migrations ORDER BY timestamp DESC',
    );

    // Get migration files
    const migrationsPath = join(__dirname, '../src/migrations');
    let migrationFiles: string[] = [];

    try {
      migrationFiles = readdirSync(migrationsPath)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
        .sort();
    } catch (error) {
      console.log('No migration files found');
    }

    const executedNames = new Set(executedMigrations.map((m: any) => m.name));
    const pendingMigrations: MigrationInfo[] = [];

    for (const file of migrationFiles) {
      const migrationPath = join(migrationsPath, file);
      delete require.cache[require.resolve(migrationPath)];

      const migrationModule = require(migrationPath);
      const MigrationClass = Object.values(migrationModule)[0] as any;

      if (MigrationClass) {
        const migration = new MigrationClass();
        const migrationName = migration.name || MigrationClass.name;

        if (!executedNames.has(migrationName)) {
          // FIX: Explicitly define the object type
          pendingMigrations.push({
            name: migrationName,
            file,
          } as MigrationInfo);
        }
      }
    }

    console.log('Executed Migrations:');
    console.log('-------------------');
    if (executedMigrations.length === 0) {
      console.log('  None');
    } else {
      executedMigrations.forEach((migration: any, index: number) => {
        const date = new Date(parseInt(migration.timestamp)).toLocaleString();
        console.log(`  ${index + 1}. ${migration.name}`);
        console.log(`     Executed: ${date}`);
      });
    }

    console.log('\nPending Migrations:');
    console.log('------------------');
    if (pendingMigrations.length === 0) {
      console.log('  ✅ None - database is up to date');
    } else {
      pendingMigrations.forEach((migration, index) => {
        console.log(`  ${index + 1}. ${migration.name}`);
        console.log(`     File: ${migration.file}`);
      });
      console.log(
        `\n⚠️  ${pendingMigrations.length} pending migration(s) found`,
      );
      console.log('   Run "npm run migration:run" to apply them');
    }

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to check migration status:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

showPendingMigrations();
