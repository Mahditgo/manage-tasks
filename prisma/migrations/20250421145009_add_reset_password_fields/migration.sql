/*
  Warnings:

  - You are about to alter the column `passwordResetExpires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `passwordResetExpires` DATETIME(3) NULL;
