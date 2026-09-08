"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const report_service_1 = require("./report.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const ladgerReport = (0, catchAsync_1.default)(async (req, res) => {
    const accountsItemId = Number(req.query.accountsItemId);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await report_service_1.ReportService.getAccountLedgerReport({
        accountsItemId,
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
const partyReport = (0, catchAsync_1.default)(async (req, res) => {
    const partyId = Number(req.params.partyId);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const partyType = req.query.partyType;
    const result = await report_service_1.ReportService.partyLedgerReport({
        partyId,
        partyType,
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report -----------------------------
const rawReport = (0, catchAsync_1.default)(async (req, res) => {
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await report_service_1.ReportService.rawReport({
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report By Id -----------------------------
const rawReportById = (0, catchAsync_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await report_service_1.ReportService.getRawReportById(id, {
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report -----------------------------
const productReport = (0, catchAsync_1.default)(async (req, res) => {
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await report_service_1.ReportService.productReport({
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report By Id -----------------------------
const productReportById = (0, catchAsync_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await report_service_1.ReportService.getProductReportById(id, {
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
const balanceSheet = (0, catchAsync_1.default)(async (req, res) => {
    const date = req.query.date ? String(req.query.date) : null;
    const result = await report_service_1.ReportService.getBalanceSheet(date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Balance sheet retrieved successfully",
        data: result,
    });
});
exports.ReportControllers = {
    ladgerReport,
    partyReport,
    rawReport,
    rawReportById,
    productReport,
    productReportById,
    balanceSheet,
};
