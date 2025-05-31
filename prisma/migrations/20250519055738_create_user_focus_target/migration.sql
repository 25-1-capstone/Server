/*
  Warnings:

  - You are about to drop the column `user_id` on the `focus_target` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_id` on the `time_table` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `focus_target` DROP FOREIGN KEY `focus_target_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `time_table` DROP FOREIGN KEY `time_table_focus_target_id_fkey`;

-- DropForeignKey
ALTER TABLE `time_table` DROP FOREIGN KEY `time_table_schedule_id_fkey`;

-- DropIndex
DROP INDEX `focus_target_user_id_fkey` ON `focus_target`;

-- DropIndex
DROP INDEX `time_table_focus_target_id_fkey` ON `time_table`;

-- DropIndex
DROP INDEX `time_table_schedule_id_fkey` ON `time_table`;

-- AlterTable
ALTER TABLE `focus_target` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `time_table` DROP COLUMN `schedule_id`;

-- CreateTable
CREATE TABLE `user_focus_target` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `focus_target_id` BIGINT NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_focus_target` ADD CONSTRAINT `user_focus_target_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_focus_target` ADD CONSTRAINT `user_focus_target_focus_target_id_fkey` FOREIGN KEY (`focus_target_id`) REFERENCES `focus_target`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_table` ADD CONSTRAINT `time_table_focus_target_id_fkey` FOREIGN KEY (`focus_target_id`) REFERENCES `user_focus_target`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
