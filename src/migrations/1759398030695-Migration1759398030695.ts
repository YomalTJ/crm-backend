import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759398030695 implements MigrationInterface {
  name = 'Migration1759398030695';

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
    await queryRunner.query('ALTER TABLE `member` ADD CONSTRAINT `FK_member_addedById` FOREIGN KEY (`addedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('CREATE UNIQUE INDEX `IDX_b95fb1d183da0306b1d1a15109` ON `member` (`nic`)');
    await queryRunner.query('ALTER TABLE `provinces` MODIFY COLUMN `status` boolean NOT NULL');
    await queryRunner.query('ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_done` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_required` boolean NOT NULL DEFAULT false');
    await queryRunner.query('ALTER TABLE `blacklisted_token` MODIFY COLUMN `isValid` boolean NOT NULL DEFAULT true');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_b95fb1d183da0306b1d1a15109` ON `member`');
    await queryRunner.query('ALTER TABLE `member` DROP FOREIGN KEY `FK_member_addedById`');
  }
}
