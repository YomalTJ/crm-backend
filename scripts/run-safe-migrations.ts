import 'dotenv/config';
import dataSource from '../data-source';
import { readdirSync } from 'fs';
import { join } from 'path';
import { QueryRunner } from 'typeorm';
import 'tsconfig-paths/register';

interface TableInfo {
  TABLE_NAME: string;
}

interface ColumnInfo {
  COLUMN_NAME: string;
  TABLE_NAME: string;
}

class SafeMigrationRunner {
  private queryRunner: QueryRunner;
  private existingTables: Set<string> = new Set();
  private existingColumns: Map<string, Set<string>> = new Map();

  constructor(queryRunner: QueryRunner) {
    this.queryRunner = queryRunner;
  }

  async initialize() {
    // Get existing tables
    const tables: TableInfo[] = await this.queryRunner.manager.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       ORDER BY TABLE_NAME`,
    );

    tables.forEach((table) => {
      this.existingTables.add(table.TABLE_NAME);
    });

    // Get existing columns for each table
    const columns: ColumnInfo[] = await this.queryRunner.manager.query(
      `SELECT TABLE_NAME, COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE()
       ORDER BY TABLE_NAME, ORDINAL_POSITION`,
    );

    columns.forEach((column) => {
      if (!this.existingColumns.has(column.TABLE_NAME)) {
        this.existingColumns.set(column.TABLE_NAME, new Set());
      }
      this.existingColumns.get(column.TABLE_NAME)!.add(column.COLUMN_NAME);
    });

    console.log('🔍 Current database state loaded:');
    console.log(`  - ${this.existingTables.size} tables found`);
    let totalColumns = 0;
    this.existingColumns.forEach((cols) => (totalColumns += cols.size));
    console.log(`  - ${totalColumns} columns found`);
  }

  async executeMigrationQueries(queries: string[]): Promise<void> {
    console.log(`📝 Processing ${queries.length} queries...`);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`\n📋 Query ${i + 1}/${queries.length}:`);
      await this.executeQuery(query);
    }
  }

  private async executeQuery(query: string): Promise<void> {
    const queryUpper = query.trim().toUpperCase();
    const cleanQuery = query.trim().replace(/\s+/g, ' ');

    try {
      // Handle CREATE TABLE
      if (queryUpper.startsWith('CREATE TABLE')) {
        const tableMatch = query.match(/CREATE TABLE `?(\w+)`?/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          if (this.existingTables.has(tableName)) {
            console.log(`⏭️  Table ${tableName} already exists, skipping...`);
            return;
          }
          console.log(`🆕 Creating table: ${tableName}`);
        }
      }

      // Handle ALTER TABLE ADD COLUMN (improved detection)
      else if (
        queryUpper.includes('ALTER TABLE') &&
        queryUpper.includes('ADD COLUMN')
      ) {
        const tableMatch = query.match(
          /ALTER TABLE `?(\w+)`?\s+ADD COLUMN `?(\w+)`?/i,
        );
        if (tableMatch) {
          const tableName = tableMatch[1];
          const columnName = tableMatch[2];

          if (!this.existingTables.has(tableName)) {
            console.log(
              `❌ Table ${tableName} does not exist, skipping column addition...`,
            );
            return;
          }

          const tableColumns = this.existingColumns.get(tableName) || new Set();
          if (tableColumns.has(columnName)) {
            console.log(
              `⏭️  Column ${tableName}.${columnName} already exists, skipping...`,
            );
            return;
          }
          console.log(`➕ Adding column: ${tableName}.${columnName}`);
        }
      }

      // Handle ALTER TABLE ADD (without COLUMN keyword - some migrations might not have it)
      else if (
        queryUpper.includes('ALTER TABLE') &&
        queryUpper.includes('ADD ') &&
        !queryUpper.includes('CONSTRAINT') &&
        !queryUpper.includes('ADD COLUMN')
      ) {
        // This handles: ALTER TABLE `table_name` ADD `column_name` datatype
        const tableMatch = query.match(
          /ALTER TABLE `?(\w+)`?\s+ADD `?(\w+)`?/i,
        );
        if (tableMatch) {
          const tableName = tableMatch[1];
          const columnName = tableMatch[2];

          if (!this.existingTables.has(tableName)) {
            console.log(
              `❌ Table ${tableName} does not exist, skipping column addition...`,
            );
            return;
          }

          const tableColumns = this.existingColumns.get(tableName) || new Set();
          if (tableColumns.has(columnName)) {
            console.log(
              `⏭️  Column ${tableName}.${columnName} already exists, skipping...`,
            );
            return;
          }
          console.log(`➕ Adding column: ${tableName}.${columnName}`);
        }
      }

      // Handle ALTER TABLE ADD CONSTRAINT (Foreign Keys)
      else if (
        queryUpper.includes('ALTER TABLE') &&
        queryUpper.includes('ADD CONSTRAINT')
      ) {
        const constraintMatch = query.match(/ADD CONSTRAINT `?(\w+)`?/i);
        if (constraintMatch) {
          const constraintName = constraintMatch[1];

          // Check if foreign key constraint already exists
          const existingConstraints = await this.queryRunner.manager.query(
            `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
             WHERE TABLE_SCHEMA = DATABASE() 
             AND CONSTRAINT_NAME = ?
             AND REFERENCED_TABLE_NAME IS NOT NULL`,
            [constraintName],
          );

          if (existingConstraints.length > 0) {
            console.log(
              `⏭️  Foreign key constraint ${constraintName} already exists, skipping...`,
            );
            return;
          }
          console.log(`🔗 Adding foreign key constraint: ${constraintName}`);
        }
      }

      // Handle DROP COLUMN
      else if (
        queryUpper.includes('ALTER TABLE') &&
        queryUpper.includes('DROP COLUMN')
      ) {
        const match = query.match(
          /ALTER TABLE `?(\w+)`?\s+DROP COLUMN `?(\w+)`?/i,
        );
        if (match) {
          const tableName = match[1];
          const columnName = match[2];

          const tableColumns = this.existingColumns.get(tableName) || new Set();
          if (!tableColumns.has(columnName)) {
            console.log(
              `⏭️  Column ${tableName}.${columnName} doesn't exist, skipping drop...`,
            );
            return;
          }
          console.log(`➖ Dropping column: ${tableName}.${columnName}`);
        }
      }

      // Execute the query
      await this.queryRunner.manager.query(query);
      console.log(`✅ Executed successfully`);

      // Update our internal state for CREATE TABLE and ADD COLUMN operations
      if (queryUpper.startsWith('CREATE TABLE')) {
        const tableMatch = query.match(/CREATE TABLE `?(\w+)`?/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          this.existingTables.add(tableName);
          this.existingColumns.set(tableName, new Set());

          // Extract column names from CREATE TABLE statement
          const columnMatches = query.match(/`(\w+)`\s+\w+/gi);
          if (columnMatches) {
            const tableColumns = this.existingColumns.get(tableName)!;
            columnMatches.forEach((match) => {
              const colName = match.match(/`(\w+)`/)?.[1];
              if (colName && colName !== tableName) {
                tableColumns.add(colName);
              }
            });
          }
        }
      }
      // Handle both ADD COLUMN and ADD without COLUMN
      else if (
        queryUpper.includes('ALTER TABLE') &&
        queryUpper.includes('ADD ') &&
        !queryUpper.includes('CONSTRAINT')
      ) {
        const tableMatch = query.match(
          /ALTER TABLE `?(\w+)`?\s+ADD(?:\s+COLUMN)?\s+`?(\w+)`?/i,
        );
        if (tableMatch) {
          const tableName = tableMatch[1];
          const columnName = tableMatch[2];
          if (this.existingColumns.has(tableName)) {
            this.existingColumns.get(tableName)!.add(columnName);
          }
        }
      }
      // Handle DROP COLUMN
      else if (
        queryUpper.includes('ALTER TABLE') &&
        queryUpper.includes('DROP COLUMN')
      ) {
        const match = query.match(
          /ALTER TABLE `?(\w+)`?\s+DROP COLUMN `?(\w+)`?/i,
        );
        if (match) {
          const tableName = match[1];
          const columnName = match[2];
          if (this.existingColumns.has(tableName)) {
            this.existingColumns.get(tableName)!.delete(columnName);
          }
        }
      }
    } catch (error: any) {
      console.error(`❌ Failed to execute query:`, error.message);
      console.error(`📋 Query was: ${cleanQuery.substring(0, 200)}...`);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting enhanced safe migration process...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);

    const srcMigrationsPath = join(__dirname, '../src/migrations');
    console.log('Looking for migrations in:', srcMigrationsPath);

    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Check current database state
    const tables = await dataSource.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       ORDER BY TABLE_NAME`,
    );

    console.log('\n📋 Current tables in database:');
    if (tables.length === 0) {
      console.log('  - No tables found (fresh database)');
    } else {
      tables.forEach((table: any) => console.log(`  - ${table.TABLE_NAME}`));
    }

    // Ensure migrations table exists
    const migrationTableExists = await dataSource.query(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'migrations'`,
    );

    if (migrationTableExists[0].count === 0) {
      await dataSource.query(`
        CREATE TABLE \`migrations\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`timestamp\` bigint NOT NULL,
          \`name\` varchar(255) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
      `);
      console.log('✅ Created migrations table');
    }

    // Check for migration files
    let migrationFiles: string[] = [];
    try {
      migrationFiles = readdirSync(srcMigrationsPath)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
        .sort(); // Sort to ensure consistent order
    } catch (error) {
      console.log('No migration files found in src/migrations');
    }

    if (migrationFiles.length === 0) {
      console.log('✅ No migration files found');
      await dataSource.destroy();
      process.exit(0);
    }

    console.log(`\n🔍 Found ${migrationFiles.length} migration file(s)`);
    migrationFiles.forEach((file) => console.log(`  - ${file}`));

    // Get already executed migrations
    const executedMigrations = await dataSource.query(
      'SELECT name FROM migrations ORDER BY timestamp',
    );
    const executedNames = new Set(executedMigrations.map((m: any) => m.name));

    // Run pending migrations
    console.log('\n🔄 Processing migrations...');
    let newMigrationsRun = 0;

    for (const file of migrationFiles) {
      const migrationPath = join(srcMigrationsPath, file);

      try {
        // Clear require cache to ensure fresh import
        delete require.cache[require.resolve(migrationPath)];

        const migrationModule = require(migrationPath);
        const MigrationClass = Object.values(migrationModule)[0] as any;

        if (!MigrationClass) {
          console.log(`⚠️  No migration class found in ${file}, skipping...`);
          continue;
        }

        const migration = new MigrationClass();

        if (executedNames.has(migration.name || MigrationClass.name)) {
          console.log(
            `⭐️ Skipping already executed migration: ${migration.name || MigrationClass.name}`,
          );
          continue;
        }

        console.log(
          `\n🔄 Running migration: ${migration.name || MigrationClass.name}`,
        );

        // Create safe migration runner
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        const safeMigration = new SafeMigrationRunner(queryRunner);
        await safeMigration.initialize();

        // Extract the SQL queries from the migration
        const queries = extractQueriesFromMigration(migration.up.toString());

        if (queries.length === 0) {
          console.log(`⚠️  No queries found in migration, skipping...`);
          await queryRunner.release();
          continue;
        }

        console.log(`📝 Found ${queries.length} queries to execute`);

        // Execute the queries safely
        await safeMigration.executeMigrationQueries(queries);

        // Record migration as executed
        const migrationName = migration.name || MigrationClass.name;
        const timestamp =
          migrationName.match(/^(\d+)/)?.[1] || Date.now().toString();

        await dataSource.query(
          'INSERT INTO migrations (timestamp, name) VALUES (?, ?)',
          [timestamp, migrationName],
        );

        console.log(`✅ Migration ${migrationName} completed successfully`);
        newMigrationsRun++;

        await queryRunner.release();
      } catch (error: any) {
        console.error(`❌ Failed to run migration ${file}:`, error.message);
        console.error('Stack trace:', error.stack);
        throw error;
      }
    }

    if (newMigrationsRun === 0) {
      console.log('\n✅ No new migrations to run - database is up to date');
    } else {
      console.log(
        `\n✅ Successfully executed ${newMigrationsRun} new migration(s)`,
      );
    }

    // Show final database state
    const finalTables = await dataSource.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       ORDER BY TABLE_NAME`,
    );

    console.log('\n📋 Final tables in database:');
    finalTables.forEach((table: any) => console.log(`  - ${table.TABLE_NAME}`));

    // Verify samurdhi_family table structure
    console.log('\n🔍 Verifying samurdhi_family table structure:');
    try {
      const columns = await dataSource.query(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'samurdhi_family' 
         ORDER BY ORDINAL_POSITION`,
      );

      console.log(`Found ${columns.length} columns in samurdhi_family:`);
      columns.forEach((col: any) => {
        console.log(
          `  - ${col.COLUMN_NAME} (${col.DATA_TYPE}, ${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`,
        );
      });
    } catch (error) {
      console.log('Could not verify samurdhi_family table structure');
    }

    await dataSource.destroy();
    console.log('\n🎉 Migration process completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Migration process failed:', err.message);
    console.error('Stack trace:', err.stack);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    process.exit(1);
  }
}

function extractQueriesFromMigration(migrationCode: string): string[] {
  const queries: string[] = [];
  const seenQueries = new Set<string>(); // Track seen queries to avoid duplicates

  // Single comprehensive pattern to capture SQL queries
  const queryPattern =
    /(?:await\s+)?queryRunner\.query\((['"`])((?:\\\1|(?!\1).)*)\1\)/g;

  let match;
  while ((match = queryPattern.exec(migrationCode)) !== null) {
    const quoteChar = match[1];
    let query = match[2];

    // Clean up the query based on quote type
    if (quoteChar === '`') {
      query = query.replace(/\\`/g, '`');
    } else if (quoteChar === "'") {
      query = query.replace(/\\'/g, "'");
    } else if (quoteChar === '"') {
      query = query.replace(/\\"/g, '"');
    }

    // Remove other escape sequences
    query = query
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\([^`'"nrt])/g, '$1');

    // Normalize the query for comparison (remove extra spaces)
    const normalizedQuery = query.replace(/\s+/g, ' ').trim();

    // Only add if we haven't seen this query before
    if (!seenQueries.has(normalizedQuery)) {
      queries.push(query);
      seenQueries.add(normalizedQuery);
    }
  }

  // Debug: Log extracted queries
  console.log(`📝 Extracted ${queries.length} unique queries from migration`);
  queries.forEach((q, i) => {
    console.log(`  ${i + 1}. ${q.substring(0, 80).replace(/\s+/g, ' ')}...`);
  });

  return queries;
}

main();
