"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionService = void 0;
const client_1 = require("@prisma/client");
const generateVoucherNumber_1 = require("../../../helpars/generateVoucherNumber");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createProduction = async (id, payload) => {
    const isProductExisted = await prisma_1.default.product.findFirst({
        where: {
            id: payload.productinfo.productId,
            isDeleted: false,
        },
    });
    if (!isProductExisted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product not found");
    }
    const addProduction = await prisma_1.default.$transaction(async (tx) => {
        let transactionInfo;
        if (id && id > 0) {
            const existingTx = await tx.transactionInfo.findUnique({
                where: { id },
            });
            if (!existingTx) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Production record not found");
            }
            transactionInfo = await tx.transactionInfo.update({
                where: { id },
                data: {
                    batchNo: payload.batchNo,
                    date: new Date(payload.date),
                },
            });
            // Clear existing child items to re-create them with updated data
            await tx.inventory.deleteMany({
                where: { transactionId: transactionInfo.id },
            });
            await tx.productionExpensesInventory.deleteMany({
                where: { transectionId: transactionInfo.id },
            });
            await tx.pMInventory.deleteMany({
                where: { transactionId: transactionInfo.id },
            });
        }
        else {
            const VoucherNo = await (0, generateVoucherNumber_1.GenerateVoucherNumber)("PROD");
            transactionInfo = await tx.transactionInfo.create({
                data: {
                    voucherNo: VoucherNo,
                    batchNo: payload.batchNo,
                    date: new Date(payload.date),
                    voucherType: client_1.VoucherType.PRODUCTION,
                },
            });
        }
        // 1. Add finished product entry to inventory
        await tx.inventory.create({
            data: {
                productId: payload.productinfo.productId,
                transactionId: transactionInfo.id,
                date: new Date(payload.date),
                department: client_1.Department.PRODUCTION,
                quantityAdd: Number(payload.productinfo.quantity) || 0,
                unitPrice: Number(payload.productinfo.unitPrice) || 0,
                debitAmount: (Number(payload.productinfo.quantity) || 0) *
                    (Number(payload.productinfo.unitPrice) || 0),
            },
        });
        // 2. Add raw materials consumed to inventory
        if (payload?.rawMaterials && payload.rawMaterials.length > 0) {
            for (const item of payload.rawMaterials) {
                const rawMaterial = await tx.rawMaterial.findFirst({
                    where: {
                        id: item.rawId,
                        status: client_1.Status.ACTIVE,
                    },
                });
                if (!rawMaterial) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Raw Material with ID ${item.rawId} not found`);
                }
                await tx.inventory.create({
                    data: {
                        rawId: rawMaterial.id,
                        transactionId: transactionInfo.id,
                        date: new Date(payload.date),
                        department: client_1.Department.PRODUCTION,
                        quantityLess: Number(item.quantity) || 0,
                        unitPrice: Number(item.unitPrice) || 0,
                        creditAmount: (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
                    },
                });
            }
        }
        // 3. Add production expenses
        if (payload?.productionExpenses && payload.productionExpenses.length > 0) {
            for (const Item of payload.productionExpenses) {
                const expencesItem = await tx.productionExpenseItem.findFirst({
                    where: {
                        id: Item.proExpencesItemId,
                    },
                });
                if (!expencesItem) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Production Expense Item with ID ${Item.proExpencesItemId} not found`);
                }
                await tx.productionExpensesInventory.create({
                    data: {
                        date: new Date(payload.date),
                        proExpencesItemId: expencesItem.id,
                        transectionId: transactionInfo.id,
                        unitRate: Number(Item.unitRate) || 0,
                        expDuration: Number(Item.expDuration) || 0,
                        amount: Number(Item.amount) ||
                            (Number(Item.unitRate) || 0) * (Number(Item.expDuration) || 0),
                    },
                });
            }
        }
        // 4. Add packing materials consumed
        if (payload?.packingMaterials && payload.packingMaterials.length > 0) {
            for (const packmaterial of payload.packingMaterials) {
                const packmaterials = await tx.packingMaterial.findFirst({
                    where: {
                        id: packmaterial.packingMaterialId,
                    },
                });
                if (!packmaterials) {
                    throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Packing Material Item with ID ${packmaterial.packingMaterialId} not found`);
                }
                await tx.pMInventory.create({
                    data: {
                        date: new Date(payload.date),
                        packingMaterialId: packmaterials.id,
                        transactionId: transactionInfo.id,
                        department: client_1.Department.PRODUCTION,
                        perUnitQty: Number(packmaterial.perUnitQty) || 0,
                        perUnitCost: Number(packmaterial.perUnitCost) || 0,
                        unitPrice: Number(packmaterial.unitPrice) || 0,
                        quantityLess: Number(packmaterial.Qty) || 0,
                    },
                });
            }
        }
        return transactionInfo;
    });
    const getCreatedProduction = await prisma_1.default.transactionInfo.findUnique({
        where: {
            id: addProduction.id,
        },
        include: {
            inventory: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    raWMaterial: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            pminventories: {
                include: {
                    packingMaterial: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            productionExpensesInventory: {
                include: {
                    productionExpenseItem: {
                        select: {
                            id: true,
                            expItemName: true,
                        },
                    },
                },
            },
        },
    });
    return getCreatedProduction;
};
const getProduction = async () => {
    const result = await prisma_1.default.transactionInfo.findMany({
        where: {
            voucherType: client_1.VoucherType.PRODUCTION,
        },
        include: {
            inventory: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    raWMaterial: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            pminventories: {
                include: {
                    packingMaterial: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            productionExpensesInventory: {
                include: {
                    productionExpenseItem: {
                        select: {
                            id: true,
                            expItemName: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });
    return result;
};
const getProductionById = async (id) => {
    const result = await prisma_1.default.transactionInfo.findUnique({
        where: {
            id: id,
        },
        include: {
            inventory: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    raWMaterial: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            pminventories: {
                include: {
                    packingMaterial: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            productionExpensesInventory: {
                include: {
                    productionExpenseItem: {
                        select: {
                            id: true,
                            expItemName: true,
                        },
                    },
                },
            },
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Production not found");
    }
    return result;
};
const deleteProduction = async (id) => {
    const isExist = await prisma_1.default.transactionInfo.findUnique({
        where: {
            id: id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Production not found");
    }
    await prisma_1.default.$transaction(async (tx) => {
        await tx.inventory.deleteMany({
            where: { transactionId: id },
        });
        await tx.pMInventory.deleteMany({
            where: { transactionId: id },
        });
        await tx.productionExpensesInventory.deleteMany({
            where: { transectionId: id },
        });
        await tx.transactionInfo.delete({
            where: { id: id },
        });
    });
    return isExist;
};
exports.ProductionService = {
    createProduction,
    getProduction,
    getProductionById,
    deleteProduction,
};
