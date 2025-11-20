-- AlterTable
ALTER TABLE `disabled_focus_target_time_table` MODIFY `measurement_end_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `empty_time_table` MODIFY `measurement_end_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `enabled_focus_target_time_table` MODIFY `measurement_end_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `offline_time_table` MODIFY `measurement_end_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `status_time_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `status_time_table` ADD CONSTRAINT `status_time_table_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
