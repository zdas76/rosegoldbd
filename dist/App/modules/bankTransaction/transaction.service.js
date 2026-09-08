"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankTransactionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const getAllTransaction = async () => {
    const result = await prisma_1.default.bankTransaction.findMany({
        include: {
            bankAccount: true,
        },
    });
    return result;
};
const getTransactionById = async (id) => {
    const result = await prisma_1.default.bankTransaction.findFirst({
        where: { id },
        include: {
            bankAccount: true,
        },
    });
    return result;
};
const updateTransactionInfo = async (id, payload) => {
    //check account number isExisted
    const accountExisted = await prisma_1.default.bankTransaction.findFirst({
        where: { id },
    });
    if (!accountExisted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Account Found");
    }
    const result = await prisma_1.default.bankTransaction.update({
        where: { id },
        data: payload,
    });
    return result;
};
exports.BankTransactionService = {
    getAllTransaction,
    getTransactionById,
    updateTransactionInfo,
};
