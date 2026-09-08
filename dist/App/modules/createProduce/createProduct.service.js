"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const createProductInfo = async (payLoad) => {
    const addProduct = await prisma_1.default.$transaction(async (tx) => {
        // create Transaction
        const createTransaction = await tx.transactionInfo.create({
            data: {
                voucherNo: payLoad.voucherNo,
                voucherType: client_1.VoucherType.CREATEPRODUCT,
            },
        });
        // 2. check product item
        const isProductExisted = await prisma_1.default.product.findFirst({
            where: {
                id: payLoad.product.productId,
                isDeleted: false,
            },
        });
        if (!isProductExisted) {
            throw new Error(`Product not found.`);
        }
        const productInventory = {
            productId: isProductExisted.id,
            date: new Date(payLoad.date),
            transactionId: createTransaction.id,
            quantityAdd: payLoad.product.quantity,
            unitPrice: payLoad.product.unitcost,
            debitAmount: payLoad.product.amount,
        };
        // 3. Check Raw Materials
        const isRawMaterialExisted = payLoad.rawMaterials.map(async (item) => await prisma_1.default.product.findFirst({
            where: {
                id: item.rawMaterialsId,
                isDeleted: false,
            },
        }));
        if (!isRawMaterialExisted) {
            throw new Error(`Invalid raw material.`);
        }
        const rowMaterialInventory = payLoad.rawMaterials.map((item) => ({
            rawId: item.rawMaterialsId,
            transactionId: createTransaction.id,
            date: new Date(payLoad.date),
            quantityLess: item.quantity,
            unitPrice: item.rawUnitprice,
            creditAmount: item.amount,
        }));
        const InventoryItem = [...rowMaterialInventory, productInventory];
        await tx.inventory.createMany({
            data: InventoryItem,
        });
        // Step 3: Prepare Journal Credit Entries (For Payment Accounts)
        const costItemsJournal = payLoad.expenses.map((item) => ({
            transectionId: createTransaction.id,
            accountsItemId: item.accountsItemId,
            date: new Date(payLoad.date),
            debitAmount: item.amount,
            narration: item.narration || "",
        }));
        await tx.journal.createMany({
            data: costItemsJournal,
        });
        return createTransaction;
    });
    const getCreatedProduct = await prisma_1.default.transactionInfo.findFirst({
        where: {
            id: addProduct.id,
        },
        include: {
            journal: true,
        },
    });
    return getCreatedProduct;
};
exports.CreateProductServices = {
    createProductInfo,
};
