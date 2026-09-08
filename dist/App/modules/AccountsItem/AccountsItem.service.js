"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountItemService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createAccountsItemtoDB = async (payLoad) => {
    const accountsItemId = Number(payLoad.accountHeadId) + payLoad.accountsItemId;
    const isExistItemId = await prisma_1.default.accountsItem.findFirst({
        where: {
            accountsItemId: accountsItemId,
        },
    });
    if (isExistItemId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This item already exist");
    }
    const checkName = await prisma_1.default.accountsItem.findFirst({
        where: {
            accountsItemName: payLoad.accountsItemName,
        },
    });
    if (checkName) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Accounts item name already exist");
    }
    const result = await prisma_1.default.accountsItem.create({
        data: {
            accountsItemId: accountsItemId,
            accountsItemName: payLoad.accountsItemName,
            accountHeadId: payLoad.accountHeadId,
        },
    });
    return result;
};
const getAccountsItemFromDB = async (payLoad) => {
    let filerValue = {};
    if (payLoad) {
        const filer = JSON.parse(payLoad).map((id) => {
            return { accountMainPillerId: id };
        });
        filerValue = {
            OR: filer,
        };
    }
    const result = await prisma_1.default.accountsItem.findMany({
        where: filerValue,
        orderBy: {
            accountHeadId: "asc",
        },
        include: {
            accountHead: true,
        },
    });
    return result;
};
const getAccountsItemByIdFromDB = async (id) => {
    const result = await prisma_1.default.accountsItem.findFirst({
        where: { id },
        include: {
            accountHead: true,
        },
    });
    return result;
};
const updateAccountsItemFromDBbyId = async (id, payLoad) => {
    const isExistItemId = await prisma_1.default.accountsItem.findFirst({
        where: {
            id: id,
        },
    });
    if (!isExistItemId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This item not found");
    }
    const accountsItemId = Number(payLoad.accountHeadId) + isExistItemId.accountsItemId.toString().slice(-4);
    const checkName = await prisma_1.default.accountsItem.findFirst({
        where: {
            accountsItemName: payLoad.accountsItemName,
            accountsItemId: isExistItemId.accountsItemId,
            NOT: {
                id: id,
            },
        },
    });
    if (checkName) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Accounts item name already exist");
    }
    const result = await prisma_1.default.accountsItem.update({
        where: { id },
        data: {
            accountsItemId: accountsItemId,
            accountsItemName: payLoad.accountsItemName,
            accountHeadId: payLoad.accountHeadId,
        },
    });
    return result;
};
exports.AccountItemService = {
    createAccountsItemtoDB,
    getAccountsItemFromDB,
    getAccountsItemByIdFromDB,
    updateAccountsItemFromDBbyId,
};
