/*
  Warnings:

  - You are about to drop the column `category` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `itemInUse` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `totalBorrowed` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `totalReturned` on the `report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `category`,
    DROP COLUMN `endDate`,
    DROP COLUMN `itemInUse`,
    DROP COLUMN `location`,
    DROP COLUMN `startDate`,
    DROP COLUMN `totalBorrowed`,
    DROP COLUMN `totalReturned`,
    ADD COLUMN `analysisPeriodId` INTEGER NULL,
    MODIFY `borrowId` INTEGER NULL;

-- CreateTable
CREATE TABLE `UsageAnalysis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `totalBorrowed` INTEGER NOT NULL,
    `totalReturned` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reportId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalysisPeriod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `frequentlyBorrowedItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reportId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ineficientItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `totalBorrowed` INTEGER NOT NULL,
    `totalLateReturned` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reportId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_analysisPeriodId_fkey` FOREIGN KEY (`analysisPeriodId`) REFERENCES `AnalysisPeriod`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsageAnalysis` ADD CONSTRAINT `UsageAnalysis_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frequentlyBorrowedItems` ADD CONSTRAINT `frequentlyBorrowedItems_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ineficientItems` ADD CONSTRAINT `ineficientItems_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
