"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createProduct = async (payload) => {
    const isExist = await prisma_1.default.product.findFirst({
        where: {
            name: payload.name,
            isDeleted: false,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This product is already existed");
    }
    const result = await prisma_1.default.product.create({
        data: {
            name: payload.name,
            description: payload.description,
            unitId: payload.unitId,
            subCategoryId: payload.subCategoryId,
            minPrice: payload.minPrice || 0,
            size: payload.size || "",
            openingDate: new Date(payload.initialStock.date),
            openingAmount: Number(payload.initialStock.amount),
            quantity: payload.initialStock.quantity,
            unitPrice: payload.initialStock.unitPrice,
            inventory: {
                create: {
                    date: payload.initialStock.date,
                    unitPrice: payload.initialStock.unitPrice,
                    quantityAdd: payload.initialStock.quantity,
                    debitAmount: Number(payload.initialStock.amount),
                    isOpening: true,
                },
            },
        },
    });
    return result;
};
const gerProduct = async () => {
    const result = await prisma_1.default.product.findMany({
        include: {
            unit: {
                select: {
                    name: true,
                },
            },
            subCategory: {
                select: {
                    subCategoryName: true,
                },
            },
        },
    });
    return result;
};
const gerProductById = async (id) => {
    const result = await prisma_1.default.product.findFirst({
        where: {
            id: id,
        },
    });
    return result;
};
const updateProductById = async (id, payload) => {
    const isExist = await prisma_1.default.product.findFirst({
        where: { id: id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No product found");
    }
    const result = await prisma_1.default.product.update({
        where: {
            id: id,
        },
        data: {
            name: payload.name,
            description: payload.description,
            unitId: payload.unitId,
            subCategoryId: payload.subCategoryId,
            minPrice: payload.minPrice || 0,
            size: payload.size || "",
        },
    });
    return result;
};
const deleteProductById = async (id) => {
    const isExist = await prisma_1.default.product.findFirst({
        where: { id: id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No product found");
    }
    const result = await prisma_1.default.product.update({
        where: {
            id: id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
};
exports.ProductService = {
    createProduct,
    gerProduct,
    gerProductById,
    updateProductById,
    deleteProductById,
};
