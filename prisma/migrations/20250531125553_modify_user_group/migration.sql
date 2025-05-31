/*
  Warnings:

  - You are about to drop the column `groupId` on the `user_group` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_group` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `user_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_group` DROP FOREIGN KEY `user_group_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `user_group` DROP FOREIGN KEY `user_group_userId_fkey`;

-- DropIndex
DROP INDEX `group_id` ON `user_group`;

-- DropIndex
DROP INDEX `user_id` ON `user_group`;

-- AlterTable
ALTER TABLE `user_group` DROP COLUMN `groupId`,
    DROP COLUMN `userId`,
    ADD COLUMN `group_id` BIGINT NOT NULL,
    ADD COLUMN `user_id` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
