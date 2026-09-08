"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const journal_service_1 = require("./journal.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const addPurcherReceived = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createPurchestReceivedIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Purchase Received create successfully",
        data: result,
    });
});
const createSalseVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createSalesVoucher(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Salse created successfully",
        data: result,
    });
});
const createMaterialSaleVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createMaterialSaleVoucher(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Salse created successfully",
        data: result,
    });
});
const createReceiptdVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createReceiptVoucher(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Receipt created successfully",
        data: result,
    });
});
const createPaymentdVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createPaymentVoucher(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Payment created successfully",
        data: result,
    });
});
const createJournalVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createJournalVoucher(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Jurnal created successfully",
        data: result,
    });
});
const createContraVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.createQantaVoucher(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Contra created successfully",
        data: result,
    });
});
const getTotalByAccountId = (0, catchAsync_1.default)(async (req, res) => {
    const result = await journal_service_1.JurnalService.getItemTotalByAccountId(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Payment created successfully",
        data: result,
    });
});
exports.JournalControllers = {
    addPurcherReceived,
    createSalseVoucher,
    createMaterialSaleVoucher,
    createReceiptdVoucher,
    createPaymentdVoucher,
    createJournalVoucher,
    createContraVoucher,
    getTotalByAccountId,
};
