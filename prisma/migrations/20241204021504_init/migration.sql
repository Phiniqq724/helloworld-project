/*
  Warnings:

  - You are about to drop the column `group` on the `report` table. All the data in the column will be lost.
  - Added the required column `category` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `group`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;
