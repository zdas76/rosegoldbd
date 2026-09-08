"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountItemController = void 0;
const AccountsItem_service_1 = require("./AccountsItem.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createAccountItem = (0, catchAsync_1.default)(async (req, res) => {
    const result = await AccountsItem_service_1.AccountItemService.createAccountsItemtoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Accounts Item create Successfully",
        data: result,
    });
});
const getAccountItem = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query.ids;
    const result = await AccountsItem_service_1.AccountItemService.getAccountsItemFromDB(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Accounts Item Retrived Successfully",
        data: result,
    });
});
const getAccountItemById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await AccountsItem_service_1.AccountItemService.getAccountsItemByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Accounts Item Retrived Successfully",
        data: result,
    });
});
const updateAccountItemById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await AccountsItem_service_1.AccountItemService.updateAccountsItemFromDBbyId(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Accounts Item Retrived Successfully",
        data: result,
    });
});
exports.AccountItemController = {
    createAccountItem,
    getAccountItem,
    getAccountItemById,
    updateAccountItemById,
};
