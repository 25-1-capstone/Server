/*
  Warnings:

  - You are about to drop the column `repeat_date` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `user_group_id` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `group` MODIFY `description` VARCHAR(100) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `time_table` MODIFY `todo_id` BIGINT NULL,
    MODIFY `schedule_id` BIGINT NULL,
    MODIFY `focus_target_id` BIGINT NULL;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `repeat_date`,
    ADD COLUMN `repeat_type` VARCHAR(6) NULL,
    MODIFY `is_completed` TINYINT NOT NULL DEFAULT 0,
    MODIFY `description` VARCHAR(100) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `user_group_id`;
