import catchAsync from "../../../shared/catchAsync";
import { ReportService } from "./report.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
const ladgerReport = catchAsync(async (req, res) => {
    const accountsItemId = Number(req.query.accountsItemId);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await ReportService.getAccountLedgerReport({
        accountsItemId,
        startDate,
        endDate,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
const partyReport = catchAsync(async (req, res) => {
    const partyId = Number(req.params.partyId);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const partyType = req.query.partyType;
    const result = await ReportService.partyLedgerReport({
        partyId,
        partyType,
        startDate,
        endDate,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report -----------------------------
const rawReport = catchAsync(async (req, res) => {
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await ReportService.rawReport({
        startDate,
        endDate,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report By Id -----------------------------
const rawReportById = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await ReportService.getRawReportById(id, {
        startDate,
        endDate,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report -----------------------------
const productReport = catchAsync(async (req, res) => {
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await ReportService.productReport({
        startDate,
        endDate,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
// ----------------------------------------- raw report By Id -----------------------------
const productReportById = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    const startDate = req.query.startDate ? String(req.query.startDate) : null;
    const endDate = req.query.endDate ? String(req.query.endDate) : null;
    const result = await ReportService.getProductReportById(id, {
        startDate,
        endDate,
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Ladger report retrived successfully",
        data: result,
    });
});
const balanceSheet = catchAsync(async (req, res) => {
    const date = req.query.date ? String(req.query.date) : null;
    const result = await ReportService.getBalanceSheet(date);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Balance sheet retrieved successfully",
        data: result,
    });
});
export const ReportControllers = {
    ladgerReport,
    partyReport,
    rawReport,
    rawReportById,
    productReport,
    productReportById,
    balanceSheet,
};
