/*
  Warnings:

  - You are about to drop the column `groupBy` on the `report` table. All the data in the column will be lost.
  - Added the required column `group` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemInUse` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalBorrowed` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReturned` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `groupBy`,
    ADD COLUMN `group` VARCHAR(191) NOT NULL,
    ADD COLUMN `itemInUse` INTEGER NOT NULL,
    ADD COLUMN `totalBorrowed` INTEGER NOT NULL,
    ADD COLUMN `totalReturned` INTEGER NOT NULL;
