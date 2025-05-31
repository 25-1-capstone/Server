/*
  Warnings:

  - You are about to drop the column `nickname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `concentration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `concentration` DROP FOREIGN KEY `concentration_todo_id_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `nickname`;

-- DropTable
DROP TABLE `concentration`;
