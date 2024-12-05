/*
  Warnings:

  - You are about to drop the `analysisperiod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `frequentlyborroweditems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ineficientitems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usageanalysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `frequentlyborroweditems` DROP FOREIGN KEY `frequentlyBorrowedItems_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `ineficientitems` DROP FOREIGN KEY `ineficientItems_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_analysisPeriodId_fkey`;

-- DropForeignKey
ALTER TABLE `usageanalysis` DROP FOREIGN KEY `UsageAnalysis_reportId_fkey`;

-- DropTable
DROP TABLE `analysisperiod`;

-- DropTable
DROP TABLE `frequentlyborroweditems`;

-- DropTable
DROP TABLE `ineficientitems`;

-- DropTable
DROP TABLE `report`;

-- DropTable
DROP TABLE `usageanalysis`;
