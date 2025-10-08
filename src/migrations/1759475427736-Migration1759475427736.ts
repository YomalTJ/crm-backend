import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759475427736 implements MigrationInterface {
  name = 'Migration1759475427736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_role` MODIFY COLUMN `canAdd` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE `user_role` MODIFY COLUMN `canUpdate` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE `user_role` MODIFY COLUMN `canDelete` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE `districts` MODIFY COLUMN `status` boolean NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `ds` MODIFY COLUMN `status` boolean NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `gnd` MODIFY COLUMN `status` boolean NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `zone` MODIFY COLUMN `status` boolean NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasConsentedToEmpowerment` boolean',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `isImpactEvaluation` boolean',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasDisability` boolean',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `monthlySaving` boolean NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `wantsAswesumaBankTransfer` boolean',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasOtherGovernmentSubsidy` boolean',
    );
    await queryRunner.query(
      'ALTER TABLE `provinces` MODIFY COLUMN `status` boolean NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_done` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_required` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE `blacklisted_token` MODIFY COLUMN `isValid` boolean NOT NULL DEFAULT true',
    );
    await queryRunner.query(
      'CREATE TABLE `samurdhi_account_types` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "INSERT INTO `samurdhi_account_types` (`name`, `created_at`, `updated_at`) VALUES ('Saving', NOW(), NOW())",
    );
    await queryRunner.query(
      "INSERT INTO `samurdhi_account_types` (`name`, `created_at`, `updated_at`) VALUES ('Diriya Matha', NOW(), NOW())",
    );
    await queryRunner.query(
      "INSERT INTO `samurdhi_account_types` (`name`, `created_at`, `updated_at`) VALUES ('Kekulu Lama', NOW(), NOW())",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DELETE FROM `samurdhi_account_types` WHERE `name` = 'Kekulu Lama'",
    );
    await queryRunner.query(
      "DELETE FROM `samurdhi_account_types` WHERE `name` = 'Diriya Matha'",
    );
    await queryRunner.query(
      "DELETE FROM `samurdhi_account_types` WHERE `name` = 'Saving'",
    );
    await queryRunner.query('DROP TABLE `samurdhi_account_types`');
  }
}
