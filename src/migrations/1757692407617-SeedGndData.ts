import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedGndData1757692407617 implements MigrationInterface {
  name = 'SeedGndData1757692407617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🌱 Seeding GND data (with duplicate handling)...');

    // First, drop the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE samurdhi_family 
      DROP FOREIGN KEY FK_65842b3e652c23d6b797f3ea8cb
    `);

    // Change character set for both tables
    await queryRunner.query(`
      ALTER TABLE gnd 
      CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      ALTER TABLE samurdhi_family 
      CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // Recreate the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE samurdhi_family 
      ADD CONSTRAINT FK_65842b3e652c23d6b797f3ea8cb 
      FOREIGN KEY (gnd_id) REFERENCES gnd(gnd_id)
    `);

    // Use INSERT IGNORE to skip duplicates without throwing errors
    await queryRunner.query(`
      INSERT IGNORE INTO gnd (zone_id, id, gnd_name, status, gnd_id) VALUES
      ('3', '1-1-09-03-160', 'Kalapaluwawa/කලපළුවාව/கலபலுவாவ', 1, '160'),
      ('3', '1-1-09-03-170', 'Subhoothipura/සුභූතිපුර/சுபூதிபுர', 1, '170'),
      ('3', '1-1-09-03-185', 'Batapotha/බටපොත/படபொத', 1, '185'),
      ('3', '1-1-09-03-245', 'Aruppitiya/අරුප්පිටිය/அருப்பிட்டிய', 1, '245'),
      ('3', '1-1-09-03-265', 'Pahalawela/පහළවෙල/பகலவெல', 1, '265')
    `);

    console.log('✅ GND data seeded successfully (duplicates ignored)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('↩️  Reverting GND data seed...');

    await queryRunner.query(`
      DELETE FROM gnd WHERE id IN (
        '1-1-09-03-160',
        '1-1-09-03-170', 
        '1-1-09-03-185',
        '1-1-09-03-245',
        '1-1-09-03-265'
      )
    `);

    console.log('✅ GND data reverted successfully');
  }
}
