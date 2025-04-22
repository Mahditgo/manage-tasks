-- AlterTable
ALTER TABLE `user` ADD COLUMN `passwordResetExpires` VARCHAR(191) NULL,
    ADD COLUMN `passwordResetToken` VARCHAR(191) NULL;
