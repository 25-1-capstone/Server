/*
  Warnings:

  - You are about to drop the column `end_time` on the `focus_target` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `focus_target` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `todo` table. All the data in the column will be lost.
  - Added the required column `description` to the `group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `todo` table without a default value. This is not possible if the table is not empty.
  - Made the column `end_time` on table `todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `focus_target` DROP COLUMN `end_time`,
    DROP COLUMN `start_time`,
    ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- AlterTable
ALTER TABLE `group` ADD COLUMN `description` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `start_time`,
    ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `description` VARCHAR(100) NOT NULL,
    ADD COLUMN `repeat_date` VARCHAR(6) NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` TIMESTAMP(6) NULL,
    MODIFY `end_time` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `schedule` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATETIME(3) NOT NULL,
    `repeat_type` VARCHAR(6) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `measurement_start_at` DATETIME(3) NOT NULL,
    `measurement_end_at` DATETIME(3) NOT NULL,
    `todo_id` BIGINT NOT NULL,
    `schedule_id` BIGINT NOT NULL,
    `focus_target_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_table` ADD CONSTRAINT `time_table_todo_id_fkey` FOREIGN KEY (`todo_id`) REFERENCES `todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_table` ADD CONSTRAINT `time_table_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_table` ADD CONSTRAINT `time_table_focus_target_id_fkey` FOREIGN KEY (`focus_target_id`) REFERENCES `focus_target`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
