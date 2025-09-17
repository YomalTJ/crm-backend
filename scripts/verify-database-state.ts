import 'dotenv/config';
import dataSource from '../data-source';

interface TableInfo {
  TABLE_NAME: string;
  ENGINE: string;
  TABLE_ROWS: number;
}

interface ForeignKeyInfo {
  CONSTRAINT_NAME: string;
  TABLE_NAME: string;
  COLUMN_NAME: string;
  REFERENCED_TABLE_NAME: string;
  REFERENCED_COLUMN_NAME: string;
}

async function main() {
  try {
    console.log('Database State Verification');
    console.log('==========================');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log('');

    await dataSource.initialize();

    // Get all tables
    const tables: TableInfo[] = await dataSource.query(`
      SELECT TABLE_NAME, ENGINE, TABLE_ROWS 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      ORDER BY TABLE_NAME
    `);

    console.log(`Found ${tables.length} tables:`);
    console.log('------------------');

    // Expected tables from the migration
    const expectedTables = [
      'audit_log',
      'aswasuma_category',
      'beneficiary_status',
      'current_employment',
      'districts',
      'ds',
      'empowerment_dimension',
      'gnd',
      'job_field',
      'livelihoods',
      'member',
      'project_type',
      'provinces',
      'samurdhi_subsisdy',
      'staff',
      'system_modules',
      'user',
      'user_role',
      'zone',
    ];

    tables.forEach((table) => {
      const isExpected = expectedTables.includes(table.TABLE_NAME);
      const status = isExpected ? '✓' : '?';
      console.log(
        `${status} ${table.TABLE_NAME} (${table.ENGINE}, ${table.TABLE_ROWS} rows)`,
      );
    });

    // Check for missing tables
    const existingTableNames = tables.map((t) => t.TABLE_NAME);
    const missingTables = expectedTables.filter(
      (t) => !existingTableNames.includes(t),
    );

    if (missingTables.length > 0) {
      console.log('\nMissing expected tables:');
      console.log('----------------------');
      missingTables.forEach((table) => console.log(`✗ ${table}`));
    }

    // Get foreign key constraints
    const foreignKeys: ForeignKeyInfo[] = await dataSource.query(`
      SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY TABLE_NAME, CONSTRAINT_NAME
    `);

    if (foreignKeys.length > 0) {
      console.log('\nForeign Key Constraints:');
      console.log('----------------------');
      foreignKeys.forEach((fk) => {
        console.log(
          `${fk.TABLE_NAME}.${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`,
        );
      });
    }

    // Check migration history
    const migrations = await dataSource.query(`
      SELECT name, timestamp FROM migrations ORDER BY timestamp DESC
    `);

    if (migrations.length > 0) {
      console.log('\nMigration History:');
      console.log('----------------');
      migrations.forEach((migration: any) => {
        const date = new Date(parseInt(migration.timestamp)).toLocaleString();
        console.log(`${migration.name} (${date})`);
      });
    }

    // Sample data check (if tables have data)
    console.log('\nSample Data Check:');
    console.log('----------------');

    for (const table of ['system_modules', 'user_role', 'provinces']) {
      if (existingTableNames.includes(table)) {
        try {
          const count = await dataSource.query(
            `SELECT COUNT(*) as count FROM \`${table}\``,
          );
          console.log(`${table}: ${count[0].count} records`);

          if (count[0].count > 0) {
            const sample = await dataSource.query(
              `SELECT * FROM \`${table}\` LIMIT 3`,
            );
            console.log(`  Sample data:`, JSON.stringify(sample[0], null, 2));
          }
        } catch (error) {
          console.log(`${table}: Error reading data`);
        }
      }
    }

    console.log('\nVerification completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

main();
