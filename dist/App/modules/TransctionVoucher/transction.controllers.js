import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { VoucherService } from "./transction.service";
const getAllVoucher = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const { voucherType } = req.query;
    const { searchTerm } = req.query;
    const result = await VoucherService.getAllVoucher({
        startDate: String(startDate),
        endDate: String(endDate),
        voucherType: voucherType,
        searchTerm: String(searchTerm),
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All Voucher retived Successfully",
        data: result,
    });
});
const getVoucherbyVoucherNo = catchAsync(async (req, res) => {
    const voucherNo = req.params.voucherNo;
    const result = await VoucherService.getVoucherByVoucherNo(voucherNo);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Voucher retived Successfully",
        data: result,
    });
});
const getVoucherbyid = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    const result = await VoucherService.getVoucherByid(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Voucher retived Successfully",
        data: result,
    });
});
const getDailyReport = catchAsync(async (req, res) => {
    const date = req.query.date;
    const result = await VoucherService.getDailyReport(date);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Daily Report retived Successfully",
        data: result,
    });
});
export const VoucherController = {
    getAllVoucher,
    getVoucherbyVoucherNo,
    getVoucherbyid,
    getDailyReport,
};
