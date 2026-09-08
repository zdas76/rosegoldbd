"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const getInventory = async () => {
    return await prisma_1.default.inventory.findMany({
        orderBy: [{ productId: "asc" }, { rawId: "asc" }],
    });
};
const getInventoryById = async (id) => {
    return await prisma_1.default.inventory.findFirst({
        where: {
            id,
        },
        include: {
            product: true,
            raWMaterial: true,
        },
    });
};
const getInventoryAggValueById = async (query) => {
    if (query.itemType === "product") {
        const getDate = await prisma_1.default.inventory.findFirst({
            where: {
                productId: Number(query.productId),
                isOpening: true,
            },
            orderBy: [{ id: "desc" }],
        });
        if (!getDate?.date) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "date not found");
        }
        const result = await prisma_1.default.$queryRaw `
  SELECT 
    i.productId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(i.debitAmount, 0)- IFNULL(i.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  WHERE i.productId = ${query.productId} AND i.date>=${getDate?.date}
  GROUP BY i.productId`;
        return result;
    }
    if (query.itemType === "raw") {
        const getDate = await prisma_1.default.inventory.findFirst({
            where: {
                rawId: Number(query.rawId),
                isOpening: true,
            },
            orderBy: [{ id: "desc" }],
        });
        const result = await prisma_1.default.$queryRaw `
  SELECT 
    i.rawId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(i.debitAmount, 0) - IFNULL(i.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  WHERE i.rawId = ${query.rawId} AND i.date>=${getDate?.date}
  GROUP BY i.rawId`;
        return result;
    }
};
const updateInventory = async (id, payload) => {
    return await prisma_1.default.inventory.updateMany({
        where: {},
        data: {},
    });
};
// const deleteInventory = async (id: number, payload: Inventory) => {
//   return console.log("first");
// };
exports.InventoryService = {
    getInventory,
    getInventoryById,
    getInventoryAggValueById,
    updateInventory,
    // deleteInventory,
};
