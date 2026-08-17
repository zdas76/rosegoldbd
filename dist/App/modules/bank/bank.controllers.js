import catchAsync from "../../../shared/catchAsync";
import { BankAccountService } from "./bank.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
const createBankAccount = catchAsync(async (req, res) => {
    const result = await BankAccountService.createBankAccount(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank Account create successfully",
        data: result,
    });
});
const getAllBankAccount = catchAsync(async (req, res) => {
    const result = await BankAccountService.getAllBankAccount();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank Accounts retrives successfully",
        data: result,
    });
});
const getBankAccountById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await BankAccountService.getBankAccountById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank Account retrives successfully",
        data: result,
    });
});
const updateBankAccountById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await BankAccountService.updateAccountInfo(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank Account info update successfully",
        data: result,
    });
});
const getBankLedger = catchAsync(async (req, res) => {
    const { accountId, fromDate, toDate } = req.query;
    const accountIdNumber = parseInt(accountId, 10);
    const result = await BankAccountService.getBankLedger(accountIdNumber, fromDate, toDate);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank ledger retrives successfully",
        data: result,
    });
});
export const BankControllers = {
    createBankAccount,
    getAllBankAccount,
    getBankAccountById,
    updateBankAccountById,
    getBankLedger,
};
