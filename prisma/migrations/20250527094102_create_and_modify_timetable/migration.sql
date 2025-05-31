/*
  Warnings:

  - You are about to drop the column `is_completed` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the `is_empty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `is_offline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `is_empty` DROP FOREIGN KEY `is_empty_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `is_offline` DROP FOREIGN KEY `is_offline_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `time_table` DROP FOREIGN KEY `time_table_focus_target_id_fkey`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `is_completed`;

-- DropTable
DROP TABLE `is_empty`;

-- DropTable
DROP TABLE `is_offline`;

-- DropTable
DROP TABLE `time_table`;

-- CreateTable
CREATE TABLE `offline_time_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `measurement_start_at` DATETIME(3) NOT NULL,
    `measurement_end_at` DATETIME(3) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empty_time_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `measurement_start_at` DATETIME(3) NOT NULL,
    `measurement_end_at` DATETIME(3) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disabled_focus_target_time_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `measurement_start_at` DATETIME(3) NOT NULL,
    `measurement_end_at` DATETIME(3) NOT NULL,
    `focus_target_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enabled_focus_target_time_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `measurement_start_at` DATETIME(3) NOT NULL,
    `measurement_end_at` DATETIME(3) NOT NULL,
    `focus_target_id` BIGINT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `offline_time_table` ADD CONSTRAINT `offline_time_table_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empty_time_table` ADD CONSTRAINT `empty_time_table_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disabled_focus_target_time_table` ADD CONSTRAINT `disabled_focus_target_time_table_focus_target_id_fkey` FOREIGN KEY (`focus_target_id`) REFERENCES `focus_target`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enabled_focus_target_time_table` ADD CONSTRAINT `enabled_focus_target_time_table_focus_target_id_fkey` FOREIGN KEY (`focus_target_id`) REFERENCES `focus_target`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
