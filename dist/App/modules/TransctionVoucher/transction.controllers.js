"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const transction_service_1 = require("./transction.service");
const getAllVoucher = (0, catchAsync_1.default)(async (req, res) => {
    const { startDate, endDate } = req.query;
    const { voucherType } = req.query;
    const { searchTerm } = req.query;
    const result = await transction_service_1.VoucherService.getAllVoucher({
        startDate: String(startDate),
        endDate: String(endDate),
        voucherType: voucherType,
        searchTerm: String(searchTerm),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All Voucher retived Successfully",
        data: result,
    });
});
const getVoucherbyVoucherNo = (0, catchAsync_1.default)(async (req, res) => {
    const voucherNo = req.params.voucherNo;
    const result = await transction_service_1.VoucherService.getVoucherByVoucherNo(voucherNo);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Voucher retived Successfully",
        data: result,
    });
});
const getVoucherbyid = (0, catchAsync_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const result = await transction_service_1.VoucherService.getVoucherByid(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Voucher retived Successfully",
        data: result,
    });
});
const getDailyReport = (0, catchAsync_1.default)(async (req, res) => {
    const date = req.query.date;
    const result = await transction_service_1.VoucherService.getDailyReport(date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Daily Report retived Successfully",
        data: result,
    });
});
exports.VoucherController = {
    getAllVoucher,
    getVoucherbyVoucherNo,
    getVoucherbyid,
    getDailyReport,
};
