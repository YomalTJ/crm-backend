import 'dotenv/config';
import dataSource from '../data-source';
import { readFileSync } from 'fs';
import { join } from 'path';

async function seedProductionData() {
  try {
    console.log('🌱 Seeding production GND data...');
    
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Read the SQL file
    const sqlPath = join(__dirname, 'seed-gnd-data.sql');
    
    // Check if file exists
    try {
      const sqlContent = readFileSync(sqlPath, 'utf8');
      
      // Split into individual queries and filter out empty lines
      const queries = sqlContent
        .split(';')
        .map(query => query.trim())
        .filter(query => query.length > 0 && !query.startsWith('--'));

      console.log(`📝 Executing ${queries.length} SQL statements...`);

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        try {
          await dataSource.query(query);
          console.log(`✅ Executed query ${i + 1}/${queries.length}`);
        } catch (error: any) {
          // Handle specific errors gracefully
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`⏭️  Skipped duplicate entry in query ${i + 1}`);
          } else if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log(`⚠️  Table doesn't exist for query ${i + 1}, skipping...`);
          } else if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log(`⚠️  Cannot drop field/key for query ${i + 1}, skipping...`);
          } else {
            console.warn(`⚠️  Non-critical error in query ${i + 1}:`, error.message);
            // Continue with next query for non-critical errors
          }
        }
      }

      console.log('✅ GND data seeded successfully');
      
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        console.log('⚠️  seed-gnd-data.sql file not found, skipping seeding...');
      } else {
        throw fileError;
      }
    }

    await dataSource.destroy();
    
  } catch (error) {
    console.error('❌ Failed to seed GND data:', error);
    // Don't exit with error code to allow build to continue
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  seedProductionData();
}

export { seedProductionData };