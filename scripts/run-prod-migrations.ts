import 'dotenv/config';
import { DataSource } from 'typeorm';

async function main() {
  try {
    console.log('🚀 Starting production migration process...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);

    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

    // Create data source for production (using dist folder)
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'samurdhi',
      entities: ['dist/**/*.entity{.js,.ts}'],
      migrations: ['dist/migrations/*{.js,.ts}'],
      synchronize: false,
      logging: true,
    });

    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Run migrations
    console.log('\n🔄 Running migrations...');
    const executed = await dataSource.runMigrations({
      transaction: 'each',
    });

    if (executed.length === 0) {
      console.log('✅ No new migrations to run - database is up to date');
    } else {
      console.log(`✅ Successfully executed ${executed.length} migration(s):`);
      executed.forEach((migration) => {
        console.log(`  - ${migration.name}`);
      });
    }

    await dataSource.destroy();
    console.log('\n🎉 Production migration completed successfully!');
  } catch (err) {
    console.error('\n❌ Production migration failed:', err);
    process.exit(1);
  }
}

main();
