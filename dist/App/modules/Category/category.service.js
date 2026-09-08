"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CagetoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCategoryToDB = async (payLoad) => {
    const category = await prisma_1.default.category.findFirst({
        where: {
            categoryName: payLoad.categoryName,
        },
    });
    if (category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = await prisma_1.default.category.create({
        data: {
            categoryName: payLoad.categoryName,
        },
    });
    return result;
};
const getCategory = async () => {
    const result = await prisma_1.default.category.findMany({});
    return result;
};
const categoryUpdate = async (id, payLoad) => {
    const category = await prisma_1.default.category.findFirst({
        where: {
            id: id,
        },
    });
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = await prisma_1.default.category.update({
        where: {
            id: id,
        },
        data: {
            categoryName: payLoad.categoryName,
        },
    });
    return result;
};
const getCategorybyId = async (payLoad) => {
    const result = await prisma_1.default.category.findFirstOrThrow({
        where: {
            categoryName: payLoad.categoryName,
        },
    });
    return result;
};
exports.CagetoryService = {
    createCategoryToDB,
    getCategory,
    categoryUpdate,
    getCategorybyId,
};
