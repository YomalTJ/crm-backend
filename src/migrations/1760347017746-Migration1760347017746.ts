import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1760328641980 implements MigrationInterface {
  name = 'Migration1760328641980';

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

    // ============ FIX: Data type conversion for samurdhiBankAccountType ============
    // Step 1: Create the new lookup table for account types
    await queryRunner.query(
      'CREATE TABLE `samurdhi_account_types` (`samurdhi_bank_account_type_id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, PRIMARY KEY (`samurdhi_bank_account_type_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "INSERT IGNORE INTO `samurdhi_account_types` (`name`, `created_at`, `updated_at`) VALUES ('Saving', NOW(), NOW())",
    );
    await queryRunner.query(
      "INSERT IGNORE INTO `samurdhi_account_types` (`name`, `created_at`, `updated_at`) VALUES ('Diriya Matha', NOW(), NOW())",
    );
    await queryRunner.query(
      "INSERT IGNORE INTO `samurdhi_account_types` (`name`, `created_at`, `updated_at`) VALUES ('Kekulu Lama', NOW(), NOW())",
    );

    // Step 2: Create a temporary column to hold the new integer values
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD COLUMN `samurdhiBankAccountType_temp` int NULL',
    );

    // Step 3: Map existing string values to integer IDs from the lookup table
    await queryRunner.query(`
      UPDATE \`samurdhi_family\` sf
      SET sf.\`samurdhiBankAccountType_temp\` = (
        SELECT \`samurdhi_bank_account_type_id\` 
        FROM \`samurdhi_account_types\` 
        WHERE \`name\` = sf.\`samurdhiBankAccountType\`
      )
      WHERE sf.\`samurdhiBankAccountType\` IS NOT NULL
    `);

    // Step 4: Drop the old column
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP COLUMN `samurdhiBankAccountType`',
    );

    // Step 5: Rename the temporary column to the original name
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` CHANGE COLUMN `samurdhiBankAccountType_temp` `samurdhiBankAccountType` int NULL',
    );
    // ============ END FIX ============

    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `wantsAswesumaBankTransfer` boolean',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` MODIFY COLUMN `hasOtherGovernmentSubsidy` boolean',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `district_id` = NULL WHERE `district_id` IS NOT NULL AND `district_id` NOT IN (SELECT `district_id` FROM `districts`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_district_id` FOREIGN KEY (`district_id`) REFERENCES `districts`(`district_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `ds_id` = NULL WHERE `ds_id` IS NOT NULL AND `ds_id` NOT IN (SELECT `ds_id` FROM `ds`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_ds_id` FOREIGN KEY (`ds_id`) REFERENCES `ds`(`ds_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `zone_id` = NULL WHERE `zone_id` IS NOT NULL AND `zone_id` NOT IN (SELECT `zone_id` FROM `zone`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_zone_id` FOREIGN KEY (`zone_id`) REFERENCES `zone`(`zone_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `gnd_id` = NULL WHERE `gnd_id` IS NOT NULL AND `gnd_id` NOT IN (SELECT `gnd_id` FROM `gnd`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_gnd_id` FOREIGN KEY (`gnd_id`) REFERENCES `gnd`(`gnd_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `beneficiary_type_id` = NULL WHERE `beneficiary_type_id` IS NOT NULL AND `beneficiary_type_id` NOT IN (SELECT `beneficiary_type_id` FROM `beneficiary_status`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_beneficiary_type_id` FOREIGN KEY (`beneficiary_type_id`) REFERENCES `beneficiary_status`(`beneficiary_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `refusal_reason_id` = NULL WHERE `refusal_reason_id` IS NOT NULL AND `refusal_reason_id` NOT IN (SELECT `id` FROM `empowerment_refusal_reasons`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_refusal_reason_id` FOREIGN KEY (`refusal_reason_id`) REFERENCES `empowerment_refusal_reasons`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `disability_id` = NULL WHERE `disability_id` IS NOT NULL AND `disability_id` NOT IN (SELECT `disability_id` FROM `disability`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_disability_id` FOREIGN KEY (`disability_id`) REFERENCES `disability`(`disability_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `employment_id` = NULL WHERE `employment_id` IS NOT NULL AND `employment_id` NOT IN (SELECT `employment_id` FROM `current_employment`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_employment_id` FOREIGN KEY (`employment_id`) REFERENCES `current_employment`(`employment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `subsisdy_id` = NULL WHERE `subsisdy_id` IS NOT NULL AND `subsisdy_id` NOT IN (SELECT `subsisdy_id` FROM `samurdhi_subsisdy`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_subsisdy_id` FOREIGN KEY (`subsisdy_id`) REFERENCES `samurdhi_subsisdy`(`subsisdy_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `aswesuma_cat_id` = NULL WHERE `aswesuma_cat_id` IS NOT NULL AND `aswesuma_cat_id` NOT IN (SELECT `aswesuma_cat_id` FROM `aswasuma_category`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_aswesuma_cat_id` FOREIGN KEY (`aswesuma_cat_id`) REFERENCES `aswasuma_category`(`aswesuma_cat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `empowerment_dimension_id` = NULL WHERE `empowerment_dimension_id` IS NOT NULL AND `empowerment_dimension_id` NOT IN (SELECT `empowerment_dimension_id` FROM `empowerment_dimension`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_empowerment_dimension_id` FOREIGN KEY (`empowerment_dimension_id`) REFERENCES `empowerment_dimension`(`empowerment_dimension_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `livelihood_id` = NULL WHERE `livelihood_id` IS NOT NULL AND `livelihood_id` NOT IN (SELECT `id` FROM `livelihoods`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_livelihood_id` FOREIGN KEY (`livelihood_id`) REFERENCES `livelihoods`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `project_type_id` = NULL WHERE `project_type_id` IS NOT NULL AND `project_type_id` NOT IN (SELECT `project_type_id` FROM `project_type`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_project_type_id` FOREIGN KEY (`project_type_id`) REFERENCES `project_type`(`project_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `job_field_id` = NULL WHERE `job_field_id` IS NOT NULL AND `job_field_id` NOT IN (SELECT `job_field_id` FROM `job_field`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_job_field_id` FOREIGN KEY (`job_field_id`) REFERENCES `job_field`(`job_field_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `samurdhi_family` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` ADD CONSTRAINT `FK_samurdhi_family_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `resource_needed` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `resource_needed` ADD CONSTRAINT `FK_resource_needed_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `member` SET `addedById` = NULL WHERE `addedById` IS NOT NULL AND `addedById` NOT IN (SELECT `id` FROM `user`)',
    );
    await queryRunner.query(
      'ALTER TABLE `member` ADD CONSTRAINT `FK_member_addedById` FOREIGN KEY (`addedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `provinces` MODIFY COLUMN `status` boolean NOT NULL',
    );
    await queryRunner.query(
      'UPDATE `citizens` SET `hh_reference` = NULL WHERE `hh_reference` IS NOT NULL AND `hh_reference` NOT IN (SELECT `hh_reference` FROM `households`)',
    );
    await queryRunner.query(
      'ALTER TABLE `citizens` ADD CONSTRAINT `FK_citizens_hh_reference` FOREIGN KEY (`hh_reference`) REFERENCES `households`(`hh_reference`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `housing_basic_service` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `housing_basic_service` ADD CONSTRAINT `FK_housing_basic_service_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `health_indicator` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `health_indicator` ADD CONSTRAINT `FK_health_indicator_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `grant_utilization` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `grant_utilization` ADD CONSTRAINT `FK_grant_utilization_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `domestic_dynamic` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `domestic_dynamic` ADD CONSTRAINT `FK_domestic_dynamic_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `community_participation` SET `created_by` = NULL WHERE `created_by` IS NOT NULL AND `created_by` NOT IN (SELECT `id` FROM `staff`)',
    );
    await queryRunner.query(
      'ALTER TABLE `community_participation` ADD CONSTRAINT `FK_community_participation_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` MODIFY COLUMN `gnd_id` varchar(255)',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_done` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` MODIFY COLUMN `training_activities_required` boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'UPDATE `beneficiary_training` SET `district_id` = NULL WHERE `district_id` IS NOT NULL AND `district_id` NOT IN (SELECT `district_id` FROM `districts`)',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` ADD CONSTRAINT `FK_beneficiary_training_district_id` FOREIGN KEY (`district_id`) REFERENCES `districts`(`district_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `beneficiary_training` SET `ds_id` = NULL WHERE `ds_id` IS NOT NULL AND `ds_id` NOT IN (SELECT `ds_id` FROM `ds`)',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` ADD CONSTRAINT `FK_beneficiary_training_ds_id` FOREIGN KEY (`ds_id`) REFERENCES `ds`(`ds_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `beneficiary_training` SET `zone_id` = NULL WHERE `zone_id` IS NOT NULL AND `zone_id` NOT IN (SELECT `zone_id` FROM `zone`)',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` ADD CONSTRAINT `FK_beneficiary_training_zone_id` FOREIGN KEY (`zone_id`) REFERENCES `zone`(`zone_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `beneficiary_training` SET `gnd_id` = NULL WHERE `gnd_id` IS NOT NULL AND `gnd_id` NOT IN (SELECT `gnd_id` FROM `gnd`)',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` ADD CONSTRAINT `FK_beneficiary_training_gnd_id` FOREIGN KEY (`gnd_id`) REFERENCES `gnd`(`gnd_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'UPDATE `beneficiary_training` SET `course_id` = NULL WHERE `course_id` IS NOT NULL AND `course_id` NOT IN (SELECT `id` FROM `courses`)',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` ADD CONSTRAINT `FK_beneficiary_training_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `blacklisted_token` MODIFY COLUMN `expiresAt` date NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `blacklisted_token` MODIFY COLUMN `isValid` boolean NOT NULL DEFAULT true',
    );
    await queryRunner.query(
      'ALTER TABLE `audit_log` MODIFY COLUMN `oldData` json',
    );
    await queryRunner.query(
      'ALTER TABLE `audit_log` MODIFY COLUMN `newData` json',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes in reverse order
    await queryRunner.query(
      'ALTER TABLE `audit_log` MODIFY COLUMN `newData` longtext',
    );
    await queryRunner.query(
      'ALTER TABLE `audit_log` MODIFY COLUMN `oldData` longtext',
    );
    await queryRunner.query(
      'ALTER TABLE `blacklisted_token` MODIFY COLUMN `isValid` tinyint(1)',
    );
    await queryRunner.query(
      'ALTER TABLE `blacklisted_token` MODIFY COLUMN `expiresAt` datetime',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` DROP FOREIGN KEY `FK_beneficiary_training_course_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` DROP FOREIGN KEY `FK_beneficiary_training_gnd_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` DROP FOREIGN KEY `FK_beneficiary_training_zone_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` DROP FOREIGN KEY `FK_beneficiary_training_ds_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `beneficiary_training` DROP FOREIGN KEY `FK_beneficiary_training_district_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `community_participation` DROP FOREIGN KEY `FK_community_participation_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `domestic_dynamic` DROP FOREIGN KEY `FK_domestic_dynamic_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `grant_utilization` DROP FOREIGN KEY `FK_grant_utilization_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `health_indicator` DROP FOREIGN KEY `FK_health_indicator_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `housing_basic_service` DROP FOREIGN KEY `FK_housing_basic_service_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `citizens` DROP FOREIGN KEY `FK_citizens_hh_reference`',
    );
    await queryRunner.query(
      'ALTER TABLE `member` DROP FOREIGN KEY `FK_member_addedById`',
    );
    await queryRunner.query(
      'ALTER TABLE `resource_needed` DROP FOREIGN KEY `FK_resource_needed_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_created_by`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_job_field_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_project_type_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_livelihood_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_empowerment_dimension_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_aswesuma_cat_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_subsisdy_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_employment_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_disability_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_refusal_reason_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_beneficiary_type_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_gnd_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_zone_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_ds_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `samurdhi_family` DROP FOREIGN KEY `FK_samurdhi_family_district_id`',
    );
    await queryRunner.query('DROP TABLE `samurdhi_account_types`');
  }
}
