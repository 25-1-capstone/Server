/*
  Warnings:

  - Added the required column `target_id` to the `status_time_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `status_time_table` ADD COLUMN `target_id` BIGINT NOT NULL;
