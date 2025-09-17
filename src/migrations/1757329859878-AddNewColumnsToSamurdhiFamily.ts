import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnsToSamurdhiFamily1757329418224 implements MigrationInterface {
    name = 'AddNewColumnsToSamurdhiFamily1757329418224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // REMOVE THESE UNWANTED QUERIES:
        // await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`type\` enum ('info', 'warning', 'success', 'error') NOT NULL DEFAULT 'info', \`status\` enum ('unread', 'read', 'archived') NOT NULL DEFAULT 'unread', \`member_id\` varchar(255) NULL, \`staff_id\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`read_at\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        
        // KEEP ONLY THESE QUERIES (the ones you actually want):
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` ADD \`maleBelow16\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` ADD \`femaleBelow16\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` ADD \`maleAbove60\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` ADD \`femaleAbove60\` int NOT NULL DEFAULT '0'`);
        
        // REMOVE THIS UNWANTED QUERY TOO:
        // await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_98ae1667da575e27d7ef958a2ad\` FOREIGN KEY (\`staff_id\`) REFERENCES \`staff\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // REMOVE THESE UNWANTED QUERIES:
        // await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_98ae1667da575e27d7ef958a2ad\``);
        
        // KEEP ONLY THESE QUERIES:
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` DROP COLUMN \`femaleAbove60\``);
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` DROP COLUMN \`maleAbove60\``);
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` DROP COLUMN \`femaleBelow16\``);
        await queryRunner.query(`ALTER TABLE \`samurdhi_family\` DROP COLUMN \`maleBelow16\``);
        
        // REMOVE THIS UNWANTED QUERY TOO:
        // await queryRunner.query(`DROP TABLE \`notifications\``);
    }
}