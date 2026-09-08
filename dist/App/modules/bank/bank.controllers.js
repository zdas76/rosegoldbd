"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const bank_service_1 = require("./bank.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createBankAccount = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bank_service_1.BankAccountService.createBankAccount(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank Account create successfully",
        data: result,
    });
});
const getAllBankAccount = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bank_service_1.BankAccountService.getAllBankAccount();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank Accounts retrives successfully",
        data: result,
    });
});
const getBankAccountById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await bank_service_1.BankAccountService.getBankAccountById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank Account retrives successfully",
        data: result,
    });
});
const updateBankAccountById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await bank_service_1.BankAccountService.updateAccountInfo(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank Account info update successfully",
        data: result,
    });
});
const getBankLedger = (0, catchAsync_1.default)(async (req, res) => {
    const { accountId, fromDate, toDate } = req.query;
    const accountIdNumber = parseInt(accountId, 10);
    const result = await bank_service_1.BankAccountService.getBankLedger(accountIdNumber, fromDate, toDate);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Bank ledger retrives successfully",
        data: result,
    });
});
exports.BankControllers = {
    createBankAccount,
    getAllBankAccount,
    getBankAccountById,
    updateBankAccountById,
    getBankLedger,
};
