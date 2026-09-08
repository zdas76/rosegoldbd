"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCagetoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createSubCategoryToDB = async (payLoad) => {
    const subCategory = await prisma_1.default.subCategory.findFirst({
        where: {
            subCategoryName: payLoad.subCategoryName,
        },
    });
    if (subCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = await prisma_1.default.subCategory.create({
        data: {
            subCategoryName: payLoad.subCategoryName,
            categoryId: payLoad.categoryId,
        },
    });
    return result;
};
const getSubCategory = async () => {
    const result = await prisma_1.default.subCategory.findMany({
        include: {
            category: true,
        },
    });
    return result;
};
const subCategoryUpdate = async (payLoad, id) => {
    const subCategory = await prisma_1.default.subCategory.findFirst({
        where: {
            id: id,
        },
    });
    if (!subCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Field is not founed");
    }
    const result = await prisma_1.default.subCategory.update({
        where: {
            id: subCategory.id,
        },
        data: {
            subCategoryName: payLoad.subCategoryName,
        },
    });
    return result;
};
const getCategorybyId = async (payLoad) => {
    const subCategory = await prisma_1.default.subCategory.findFirst({
        where: {
            id: payLoad.id,
        },
    });
    if (!subCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = await prisma_1.default.subCategory.findFirstOrThrow({
        where: {
            id: payLoad.id,
        },
    });
    return result;
};
// delete subcategory
const deleteSubService = async (id) => {
    const deleteResult = await prisma_1.default.subCategory.delete({
        where: {
            id: Number(id),
        }
    });
    return deleteResult;
};
exports.SubCagetoryService = {
    createSubCategoryToDB,
    getSubCategory,
    subCategoryUpdate,
    getCategorybyId,
    deleteSubService
};
