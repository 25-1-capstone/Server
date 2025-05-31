/*
  Warnings:

  - Added the required column `nickname` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `nickname` VARCHAR(30) NOT NULL,
    ADD COLUMN `user_group_id` BIGINT NULL;

-- CreateTable
CREATE TABLE `group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `groupId` BIGINT NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `user_id`(`userId`),
    UNIQUE INDEX `group_id`(`groupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `todo` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `is_completed` TINYINT NOT NULL DEFAULT 1,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concentration` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `todo_id` BIGINT NOT NULL,
    `hour` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `focus_target` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `target` VARCHAR(50) NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `user_id` BIGINT NOT NULL,
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_group` ADD CONSTRAINT `user_group_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concentration` ADD CONSTRAINT `concentration_todo_id_fkey` FOREIGN KEY (`todo_id`) REFERENCES `todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `focus_target` ADD CONSTRAINT `focus_target_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
