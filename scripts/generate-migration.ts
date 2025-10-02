import 'dotenv/config';
import 'tsconfig-paths/register';
import dataSource from '../data-source';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface TableInfo {
  TABLE_NAME: string;
}

interface ColumnInfo {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  COLUMN_DEFAULT: string | null;
  EXTRA: string;
  COLUMN_KEY: string;
}

interface ForeignKeyInfo {
  CONSTRAINT_NAME: string;
  COLUMN_NAME: string;
  REFERENCED_TABLE_NAME: string;
  REFERENCED_COLUMN_NAME: string;
  UPDATE_RULE: string;
  DELETE_RULE: string;
}

interface IndexInfo {
  INDEX_NAME: string;
  COLUMN_NAME: string;
  NON_UNIQUE: number;
}

async function generateMigration() {
  try {
    console.log('🔍 Analyzing database schema differences...');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);

    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Get entity metadata
    const entityMetadatas = dataSource.entityMetadatas;
    console.log(`📋 Found ${entityMetadatas.length} entities in code`);

    // Get existing tables from database
    const existingTables: TableInfo[] = await dataSource.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE()`,
    );
    const existingTableNames = new Set(existingTables.map((t) => t.TABLE_NAME));

    console.log(`📋 Found ${existingTableNames.size} tables in database`);

    const upQueries: string[] = [];
    const downQueries: string[] = [];
    const processedOperations = new Set<string>(); // Track processed operations

    // Check each entity
    for (const entityMetadata of entityMetadatas) {
      const tableName = entityMetadata.tableName;
      console.log(
        `\n🔍 Checking entity: ${entityMetadata.name} (table: ${tableName})`,
      );

      if (!existingTableNames.has(tableName)) {
        // Table doesn't exist - create it
        console.log(`  ➕ Table '${tableName}' needs to be created`);

        const createTableQuery = generateCreateTableQuery(entityMetadata);
        upQueries.push(createTableQuery);
        downQueries.unshift(`DROP TABLE \`${tableName}\``);
      } else {
        // Table exists - check columns
        const existingColumns: ColumnInfo[] = await dataSource.query(
          `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA, COLUMN_KEY
           FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = ?
           ORDER BY ORDINAL_POSITION`,
          [tableName],
        );

        const existingColumnMap = new Map(
          existingColumns.map((c) => [c.COLUMN_NAME, c]),
        );

        // Check for missing columns
        for (const column of entityMetadata.columns) {
          const columnName = column.databaseName;

          if (!existingColumnMap.has(columnName)) {
            console.log(
              `  ➕ Column '${tableName}.${columnName}' needs to be added`,
            );

            const addColumnQuery = generateAddColumnQuery(tableName, column);
            upQueries.push(addColumnQuery);
            downQueries.unshift(
              `ALTER TABLE \`${tableName}\` DROP COLUMN \`${columnName}\``,
            );
          } else {
            // Column exists - check if type changed
            const existingColumn = existingColumnMap.get(columnName)!;
            const expectedType = getColumnType(column);

            if (
              normalizeColumnType(existingColumn.COLUMN_TYPE) !==
              normalizeColumnType(expectedType)
            ) {
              console.log(
                `  🔄 Column '${tableName}.${columnName}' type needs to be modified`,
              );
              console.log(
                `     From: ${existingColumn.COLUMN_TYPE} To: ${expectedType}`,
              );

              const modifyColumnQuery = generateModifyColumnQuery(
                tableName,
                column,
              );
              upQueries.push(modifyColumnQuery);
            }
          }
        }

        // Check for foreign keys - FIXED QUERY
        const existingForeignKeys: ForeignKeyInfo[] = await dataSource.query(
          `SELECT 
            kcu.CONSTRAINT_NAME,
            kcu.COLUMN_NAME,
            kcu.REFERENCED_TABLE_NAME,
            kcu.REFERENCED_COLUMN_NAME,
            rc.UPDATE_RULE,
            rc.DELETE_RULE
           FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
           JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
             ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
             AND kcu.TABLE_SCHEMA = rc.CONSTRAINT_SCHEMA
           WHERE kcu.TABLE_SCHEMA = DATABASE() 
           AND kcu.TABLE_NAME = ?
           AND kcu.REFERENCED_TABLE_NAME IS NOT NULL`,
          [tableName],
        );

        const existingFKMap = new Map(
          existingForeignKeys.map((fk) => [
            `${fk.COLUMN_NAME}_${fk.REFERENCED_TABLE_NAME}`,
            fk,
          ]),
        );

        // Check entity foreign keys
        for (const foreignKey of entityMetadata.foreignKeys) {
          const columnName = foreignKey.columnNames[0];
          const referencedTable =
            foreignKey.referencedTablePath.split('.')[1] ||
            foreignKey.referencedTablePath;
          const key = `${columnName}_${referencedTable}`;

          if (!existingFKMap.has(key)) {
            console.log(
              `  🔗 Foreign key '${tableName}.${columnName}' needs to be added`,
            );

            const fkQuery = generateAddForeignKeyQuery(tableName, foreignKey);
            upQueries.push(fkQuery);

            const constraintName = `FK_${tableName}_${columnName}`;
            downQueries.unshift(
              `ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${constraintName}\``,
            );
          }
        }

        // Check indexes
        const existingIndexes: IndexInfo[] = await dataSource.query(
          `SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
           FROM INFORMATION_SCHEMA.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = ?
           AND INDEX_NAME != 'PRIMARY'`,
          [tableName],
        );

        const existingIndexMap = new Map(
          existingIndexes.map((idx) => [idx.INDEX_NAME, idx]),
        );

        // Check entity indexes
        for (const index of entityMetadata.indices) {
          const operationKey = `INDEX_${tableName}_${index.name}`;

          if (
            !existingIndexMap.has(index.name) &&
            !processedOperations.has(operationKey)
          ) {
            console.log(`  📇 Index '${index.name}' needs to be created`);

            const indexQuery = generateAddIndexQuery(tableName, index);
            upQueries.push(indexQuery);
            downQueries.unshift(
              `DROP INDEX \`${index.name}\` ON \`${tableName}\``,
            );
            processedOperations.add(operationKey);
          }
        }
      }
    }

    if (upQueries.length === 0) {
      console.log('\n✅ Database schema is up to date - no migration needed');
      await dataSource.destroy();
      process.exit(0);
    }

    // Generate migration file
    const timestamp = Date.now();
    const migrationName = `Migration${timestamp}`;
    const fileName = `${timestamp}-${migrationName}.ts`;
    const migrationsDir = join(__dirname, '../src/migrations');

    if (!existsSync(migrationsDir)) {
      mkdirSync(migrationsDir, { recursive: true });
    }

    const migrationContent = generateMigrationFile(
      migrationName,
      upQueries,
      downQueries,
    );

    const filePath = join(migrationsDir, fileName);
    writeFileSync(filePath, migrationContent);

    console.log('\n📄 Migration file generated successfully!');
    console.log(`   File: src/migrations/${fileName}`);
    console.log(`   Changes: ${upQueries.length} operations`);
    console.log('\n📋 Migration summary:');
    upQueries.forEach((query, index) => {
      const preview = query.substring(0, 80).replace(/\s+/g, ' ');
      console.log(`   ${index + 1}. ${preview}...`);
    });

    await dataSource.destroy();
    console.log('\n✅ Migration generation completed!');
  } catch (error: any) {
    console.error('\n❌ Migration generation failed:', error.message);
    console.error('Stack trace:', error.stack);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    process.exit(1);
  }
}

function generateCreateTableQuery(entityMetadata: any): string {
  const tableName = entityMetadata.tableName;
  const columns: string[] = [];
  const primaryKeys: string[] = [];

  for (const column of entityMetadata.columns) {
    const columnDef = generateColumnDefinition(column);
    columns.push(columnDef);

    if (column.isPrimary) {
      primaryKeys.push(`\`${column.databaseName}\``);
    }
  }

  let query = `CREATE TABLE \`${tableName}\` (${columns.join(', ')}`;

  if (primaryKeys.length > 0) {
    query += `, PRIMARY KEY (${primaryKeys.join(', ')})`;
  }

  query += ') ENGINE=InnoDB';

  return query;
}

function generateColumnDefinition(column: any): string {
  const columnName = column.databaseName;
  const columnType = getColumnType(column);
  let definition = `\`${columnName}\` ${columnType}`;

  if (!column.isNullable) {
    definition += ' NOT NULL';
  }

  if (column.isGenerated && column.generationStrategy === 'increment') {
    definition += ' AUTO_INCREMENT';
  }

  if (column.default !== undefined && column.default !== null) {
    // Handle different types of default values
    let defaultValue;

    if (typeof column.default === 'string') {
      // Check if it's a SQL function like NOW(), CURRENT_TIMESTAMP, etc.
      const upperDefault = column.default.toUpperCase();
      if (
        upperDefault.includes('NOW()') ||
        upperDefault.includes('CURRENT_TIMESTAMP') ||
        upperDefault.includes('CURRENT_DATE') ||
        upperDefault.includes('CURRENT_TIME')
      ) {
        defaultValue = column.default;
      } else {
        defaultValue = `'${column.default}'`;
      }
    } else if (typeof column.default === 'boolean') {
      defaultValue = column.default ? 'true' : 'false';
    } else if (typeof column.default === 'number') {
      defaultValue = column.default;
    } else {
      defaultValue = column.default;
    }

    definition += ` DEFAULT ${defaultValue}`;
  }

  return definition;
}

function generateAddColumnQuery(tableName: string, column: any): string {
  const columnDef = generateColumnDefinition(column);
  return `ALTER TABLE \`${tableName}\` ADD COLUMN ${columnDef}`;
}

function generateModifyColumnQuery(tableName: string, column: any): string {
  const columnDef = generateColumnDefinition(column);
  return `ALTER TABLE \`${tableName}\` MODIFY COLUMN ${columnDef}`;
}

function generateAddForeignKeyQuery(
  tableName: string,
  foreignKey: any,
): string {
  const columnName = foreignKey.columnNames[0];
  const referencedTablePath = foreignKey.referencedTablePath;
  const referencedTable =
    referencedTablePath.split('.')[1] || referencedTablePath;
  const referencedColumn = foreignKey.referencedColumnNames[0];
  const constraintName = `FK_${tableName}_${columnName}`;

  let query = `ALTER TABLE \`${tableName}\` ADD CONSTRAINT \`${constraintName}\` `;
  query += `FOREIGN KEY (\`${columnName}\`) `;
  query += `REFERENCES \`${referencedTable}\`(\`${referencedColumn}\`)`;

  if (foreignKey.onDelete) {
    query += ` ON DELETE ${foreignKey.onDelete}`;
  }

  if (foreignKey.onUpdate) {
    query += ` ON UPDATE ${foreignKey.onUpdate}`;
  }

  return query;
}

function generateAddIndexQuery(tableName: string, index: any): string {
  const indexName = index.name;
  const columns = index.columns
    .map((col: any) => `\`${col.databaseName}\``)
    .join(', ');
  const unique = index.isUnique ? 'UNIQUE ' : '';

  return `CREATE ${unique}INDEX \`${indexName}\` ON \`${tableName}\` (${columns})`;
}

function getColumnType(column: any): string {
  const type = column.type;

  if (typeof type === 'function') {
    const typeName = type.name.toLowerCase();
    if (typeName === 'string' || typeName.includes('varchar')) {
      return `varchar(${column.length || 255})`;
    } else if (typeName === 'number' || typeName.includes('int')) {
      return 'int';
    }
    return typeName;
  }

  if (typeof type === 'string') {
    if (type === 'int' || type === 'integer') {
      return 'int';
    } else if (type === 'varchar') {
      return `varchar(${column.length || 255})`;
    } else if (type === 'text') {
      return 'text';
    } else if (type === 'datetime') {
      return 'datetime';
    } else if (type === 'timestamp') {
      return 'timestamp';
    } else if (type === 'boolean' || type === 'bool') {
      return 'tinyint(1)';
    } else if (type === 'decimal') {
      return `decimal(${column.precision || 10},${column.scale || 2})`;
    } else if (type === 'float') {
      return 'float';
    } else if (type === 'double') {
      return 'double';
    } else if (type === 'date') {
      return 'date';
    } else if (type === 'time') {
      return 'time';
    } else if (type === 'enum') {
      const values = column.enum?.map((v: string) => `'${v}'`).join(',') || '';
      return `enum(${values})`;
    } else if (type === 'json') {
      return 'json';
    } else if (type === 'uuid') {
      return 'varchar(36)';
    }

    return type;
  }

  console.warn(
    `Unknown column type for ${column.databaseName}:`,
    typeof type,
    type,
  );
  return 'varchar(255)';
}

function normalizeColumnType(type: string): string {
  if (typeof type !== 'string') {
    type = String(type);
  }

  return type
    .replace(/\(\d+\)/g, '')
    .replace(/\(\d+,\d+\)/g, '')
    .toLowerCase()
    .trim();
}

function generateMigrationFile(
  name: string,
  upQueries: string[],
  downQueries: string[],
): string {
  // Use regular string literals instead of template literals to avoid escaping issues
  const upQueriesStr = upQueries
    .map((q) => {
      // Escape single quotes and backslashes for string literal
      const escaped = q.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return `    await queryRunner.query('${escaped}');`;
    })
    .join('\n');

  const downQueriesStr = downQueries
    .map((q) => {
      // Escape single quotes and backslashes for string literal
      const escaped = q.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return `    await queryRunner.query('${escaped}');`;
    })
    .join('\n');

  return `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${name} implements MigrationInterface {
  name = '${name}';

  public async up(queryRunner: QueryRunner): Promise<void> {
${upQueriesStr}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
${downQueriesStr}
  }
}
`;
}

generateMigration();
