import 'dotenv/config';
import dataSource from '../data-source';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function initializeMigrationSystem() {
  try {
    console.log('🔧 Initializing migration system...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('');

    // Create migrations directory if it doesn't exist
    const migrationsDir = join(__dirname, '../src/migrations');
    if (!existsSync(migrationsDir)) {
      mkdirSync(migrationsDir, { recursive: true });
      console.log('✅ Created migrations directory');
    } else {
      console.log('✓ Migrations directory exists');
    }

    // Connect to database
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Check if migrations table exists
    const migrationTableExists = await dataSource.query(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'migrations'`,
    );

    if (migrationTableExists[0].count === 0) {
      console.log('📝 Creating migrations table...');
      await dataSource.query(`
        CREATE TABLE \`migrations\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`timestamp\` bigint NOT NULL,
          \`name\` varchar(255) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✅ Migrations table created');
    } else {
      console.log('✓ Migrations table exists');
    }

    // Show current database state
    const tables = await dataSource.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       ORDER BY TABLE_NAME`,
    );

    console.log('\n📋 Current database tables:');
    if (tables.length === 0) {
      console.log('  - No tables found (fresh database)');
    } else {
      tables.forEach((table: any) => console.log(`  - ${table.TABLE_NAME}`));
    }

    // Show executed migrations
    const executedMigrations = await dataSource.query(
      'SELECT name, timestamp FROM migrations ORDER BY timestamp DESC',
    );

    console.log('\n📋 Executed migrations:');
    if (executedMigrations.length === 0) {
      console.log('  - None');
    } else {
      executedMigrations.forEach((migration: any) => {
        const date = new Date(parseInt(migration.timestamp)).toLocaleString();
        console.log(`  - ${migration.name} (${date})`);
      });
    }

    await dataSource.destroy();

    console.log('\n✅ Migration system initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. Define your entities in src/entities/');
    console.log('  2. Run "npm run migration:generate" to create migrations');
    console.log('  3. Run "npm run migration:run" to apply migrations');
    console.log(
      '  4. Or simply run "npm run build" to do everything automatically',
    );
  } catch (error: any) {
    console.error('\n❌ Initialization failed:', error.message);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    process.exit(1);
  }
}

initializeMigrationSystem();
