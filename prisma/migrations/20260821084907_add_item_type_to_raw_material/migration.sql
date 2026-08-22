-- CreateTable
CREATE TABLE `categoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categoris_categoryName_key`(`categoryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_categoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subCategoryName` VARCHAR(200) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sub_categoris_subCategoryName_key`(`subCategoryName`),
    INDEX `sub_categoris_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_head` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `headName` VARCHAR(191) NOT NULL,
    `headId` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `account_head_headId_key`(`headId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountsItemName` VARCHAR(191) NOT NULL,
    `accountHeadId` VARCHAR(2) NOT NULL,
    `accountsItemId` VARCHAR(6) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(14) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK', 'PENDING', 'CHECKED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(30) NULL,
    `name` VARCHAR(50) NOT NULL,
    `nid` VARCHAR(20) NULL,
    `dob` DATE NULL,
    `workingPlase` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(14) NOT NULL,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK', 'PENDING', 'CHECKED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_email_key`(`email`),
    INDEX `employees_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `contactNo` VARCHAR(15) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `partyType` ENUM('VENDOR', 'CUSTOMER', 'PARTY') NOT NULL,
    `openingDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `openingAmount` DOUBLE NULL DEFAULT 0.00,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    `subCategoryId` INTEGER NOT NULL,
    `minPrice` INTEGER NULL,
    `size` VARCHAR(191) NULL,
    `quantity` DOUBLE NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `unitId` INTEGER NOT NULL,
    `openingDate` DATETIME(3) NOT NULL,
    `openingAmount` DOUBLE NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK', 'PENDING', 'CHECKED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    INDEX `products_subCategoryId_name_idx`(`subCategoryId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raw_materials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(250) NULL,
    `unitId` INTEGER NOT NULL,
    `openingDate` DATETIME(3) NOT NULL,
    `openingAmount` DOUBLE NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `itemType` VARCHAR(50) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK', 'PENDING', 'CHECKED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(191) NOT NULL,
    `branceName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK', 'PENDING', 'CHECKED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bank_accounts_bankName_accountNumber_key`(`bankName`, `accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `bankAccountId` INTEGER NOT NULL,
    `transectionId` INTEGER NULL,
    `debitAmount` INTEGER NULL,
    `creditAmount` INTEGER NULL,
    `isClosing` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `productId` INTEGER NULL,
    `rawId` INTEGER NULL,
    `transactionId` INTEGER NULL,
    `productionId` INTEGER NULL,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0.00,
    `quantityAdd` DOUBLE NULL DEFAULT 0.00,
    `quantityLess` DOUBLE NULL DEFAULT 0.00,
    `discount` DOUBLE NULL DEFAULT 0.00,
    `debitAmount` DOUBLE NULL DEFAULT 0.00,
    `creditAmount` DOUBLE NULL DEFAULT 0.00,
    `isOpening` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK', 'PENDING', 'CHECKED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inventories_productId_rawId_transactionId_productionId_idx`(`productId`, `rawId`, `transactionId`, `productionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucherNo` VARCHAR(191) NOT NULL,
    `invoiceNo` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `partyId` INTEGER NULL,
    `voucherType` ENUM('SALES', 'PURCHASE', 'RECEIPT', 'PAYMENT', 'JOURNAL', 'CONTRA', 'LOGORDERS', 'CREATEPRODUCT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaction_info_voucherNo_key`(`voucherNo`),
    INDEX `transaction_info_voucherNo_voucherType_partyId_idx`(`voucherNo`, `voucherType`, `partyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transectionId` INTEGER NULL,
    `accountsItemId` INTEGER NULL,
    `date` DATE NOT NULL,
    `creditAmount` DOUBLE NULL DEFAULT 0.00,
    `debitAmount` DOUBLE NULL DEFAULT 0.00,
    `narration` VARCHAR(191) NULL,
    `isClosing` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `journals_accountsItemId_idx`(`accountsItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucherNo` VARCHAR(191) NOT NULL,
    `batchNo` VARCHAR(50) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `productions_voucherNo_key`(`voucherNo`),
    UNIQUE INDEX `productions_batchNo_key`(`batchNo`),
    INDEX `productions_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sub_categoris` ADD CONSTRAINT `sub_categoris_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_items` ADD CONSTRAINT `account_items_accountHeadId_fkey` FOREIGN KEY (`accountHeadId`) REFERENCES `account_head`(`headId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_transactions` ADD CONSTRAINT `bank_transactions_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `bank_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_transactions` ADD CONSTRAINT `bank_transactions_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_rawId_fkey` FOREIGN KEY (`rawId`) REFERENCES `raw_materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_productionId_fkey` FOREIGN KEY (`productionId`) REFERENCES `productions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_info` ADD CONSTRAINT `transaction_info_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_accountsItemId_fkey` FOREIGN KEY (`accountsItemId`) REFERENCES `account_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productions` ADD CONSTRAINT `productions_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
