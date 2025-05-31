/*
  Warnings:

  - You are about to drop the column `hostId` on the `group` table. All the data in the column will be lost.
  - Added the required column `host_id` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `host_id` ON `group`;

-- AlterTable
ALTER TABLE `group` DROP COLUMN `hostId`,
    ADD COLUMN `host_id` BIGINT NOT NULL;
