"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const transaction_service_1 = require("./transaction.service");
const getAllBankAccount = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.BankTransactionService.getAllTransaction();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank Accounts retrives successfully",
        data: result,
    });
});
const getBankAccountById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await transaction_service_1.BankTransactionService.getTransactionById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank Account retrives successfully",
        data: result,
    });
});
exports.transactionControllers = {
    getAllBankAccount,
    getBankAccountById,
};
