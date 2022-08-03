/*
  Warnings:

  - Added the required column `chatType` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat` ADD COLUMN `chatType` ENUM('PrivateChat', 'GroupChat') NOT NULL;
