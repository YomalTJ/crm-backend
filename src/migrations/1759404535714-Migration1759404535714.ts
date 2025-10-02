import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759404535714 implements MigrationInterface {
  name = 'Migration1759404535714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user_role` MODIFY COLUMN `canAdd` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `user_role` MODIFY COLUMN `canUpdate` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `user_role` MODIFY COLUMN `canDelete` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `districts` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `ds` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `gnd` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `zone` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasConsentedToEmpowerment` boolean');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `isImpactEvaluation` boolean');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasDisability` boolean');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `resource_id` json');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `monthlySaving` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `health_indicator_id` json');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `domestic_dynamic_id` json');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `community_participation_id` json');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `housing_service_id` json');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `wantsAswesumaBankTransfer` boolean');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasOtherGovernmentSubsidy` boolean');
    await queryRunner.query('ALTER TABLE `provinces` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_done` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_required` boolean NOT NULL DEFAULT false');
    await queryRunner.query('UPDATE `beneficiary_training` SET `gnd_id` = NULL WHERE `gnd_id` IS NOT NULL AND `gnd_id` NOT IN (SELECT `gnd_id` FROM `gnd`)');
    await queryRunner.query('ALTER TABLE `beneficiary_training` ADD CONSTRAINT `FK_beneficiary_training_gnd_id` FOREIGN KEY (`gnd_id`) REFERENCES `gnd`(`gnd_id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE `blacklisted_token` MODIFY COLUMN `expiresAt` date NOT NULL');
    await queryRunner.query('ALTER TABLE `blacklisted_token` MODIFY COLUMN `isValid` boolean NOT NULL DEFAULT true');
    await queryRunner.query('ALTER TABLE `audit_log` MODIFY COLUMN `oldData` json');
    await queryRunner.query('ALTER TABLE `audit_log` MODIFY COLUMN `newData` json');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `beneficiary_training` DROP FOREIGN KEY `FK_beneficiary_training_gnd_id`');
  }
}
