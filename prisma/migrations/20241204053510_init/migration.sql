-- AlterTable
ALTER TABLE `borrow` MODIFY `returnAt` DATE NOT NULL,
    MODIFY `updatedAt` DATE NOT NULL;

-- AlterTable
ALTER TABLE `return` MODIFY `createdAt` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
