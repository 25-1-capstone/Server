/*
  Warnings:

  - You are about to drop the column `todo_id` on the `time_table` table. All the data in the column will be lost.
  - You are about to drop the `todo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[hostId]` on the table `group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostId` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `time_table` DROP FOREIGN KEY `time_table_todo_id_fkey`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_user_id_fkey`;

-- DropIndex
DROP INDEX `time_table_todo_id_fkey` ON `time_table`;

-- AlterTable
ALTER TABLE `group` ADD COLUMN `hostId` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `notification` TINYINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `time_table` DROP COLUMN `todo_id`;

-- DropTable
DROP TABLE `todo`;

-- CreateIndex
CREATE UNIQUE INDEX `host_id` ON `group`(`hostId`);
