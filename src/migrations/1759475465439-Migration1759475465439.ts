import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759475465439 implements MigrationInterface {
  name = 'Migration1759475465439';

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
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `monthlySaving` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `wantsAswesumaBankTransfer` boolean');
    await queryRunner.query('ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasOtherGovernmentSubsidy` boolean');
    await queryRunner.query('ALTER TABLE `provinces` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_done` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_required` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `blacklisted_token` MODIFY COLUMN `isValid` boolean NOT NULL DEFAULT true');
    await queryRunner.query('CREATE UNIQUE INDEX `IDX_0d81fca5e952a88b7aba29a81f` ON `samurdhi_account_types` (`name`)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_0d81fca5e952a88b7aba29a81f` ON `samurdhi_account_types`');
  }
}
