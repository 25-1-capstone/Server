/*
  Warnings:

  - Made the column `repeat_type` on table `schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `schedule` MODIFY `description` VARCHAR(100) NULL,
    MODIFY `repeat_type` VARCHAR(6) NOT NULL DEFAULT '반복 안함';
