-- test-database-setup.sql
-- This script creates a test database with some existing tables and sample data
-- to demonstrate the safe migration functionality
-- Drop database if exists and create new one
DROP DATABASE IF EXISTS samurdhi_migration_test;
CREATE DATABASE samurdhi_migration_test;
USE samurdhi_migration_test;
-- Create some existing tables that already exist in the database
-- These should be skipped during migration
CREATE TABLE `system_modules` (
    `id` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
CREATE TABLE `user_role` (
    `id` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `canAdd` tinyint NOT NULL DEFAULT 0,
    `canUpdate` tinyint NOT NULL DEFAULT 0,
    `canDelete` tinyint NOT NULL DEFAULT 0,
    `moduleId` varchar(36) NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
CREATE TABLE `provinces` (
    `province_id` int NOT NULL AUTO_INCREMENT,
    `id` varchar(255) NOT NULL,
    `province_name` varchar(255) NOT NULL,
    `status` tinyint NOT NULL,
    PRIMARY KEY (`province_id`)
) ENGINE = InnoDB;
-- Insert some sample data into existing tables
INSERT INTO `system_modules` (`id`, `name`)
VALUES ('mod-001', 'User Management'),
    ('mod-002', 'Family Management'),
    ('mod-003', 'Reports');
INSERT INTO `user_role` (
        `id`,
        `name`,
        `canAdd`,
        `canUpdate`,
        `canDelete`,
        `moduleId`
    )
VALUES ('role-001', 'Administrator', 1, 1, 1, 'mod-001'),
    (
        'role-002',
        'Data Entry Officer',
        1,
        1,
        0,
        'mod-002'
    ),
    ('role-003', 'Viewer', 0, 0, 0, 'mod-003');
INSERT INTO `provinces` (`id`, `province_name`, `status`)
VALUES ('WP', 'Western Province', 1),
    ('CP', 'Central Province', 1),
    ('SP', 'Southern Province', 1);
-- Add foreign key constraint between existing tables
ALTER TABLE `user_role`
ADD CONSTRAINT `FK_0ea29503af5f3c0d0fc9b59402e` FOREIGN KEY (`moduleId`) REFERENCES `system_modules`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
-- Note: Tables like staff, districts, ds, zone, gnd, user, member, audit_log, etc. 
-- are NOT created here, so they should be created by the migration