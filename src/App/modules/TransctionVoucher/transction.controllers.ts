import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { VoucherService } from "./transction.service";
import { VoucherType } from "../../../../generated/prisma";

const getAllVoucher = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const { voucherType } = req.query;
  const { searchTerm } = req.query;
  const result = await VoucherService.getAllVoucher({
    startDate: String(startDate),
    endDate: String(endDate),
    voucherType: voucherType as VoucherType,
    searchTerm: String(searchTerm),
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Voucher retived Successfully",
    data: result,
  });
});

const getVoucherbyVoucherNo = catchAsync(
  async (req: Request, res: Response) => {
    const voucherNo = req.params.voucherNo as string;

    const result = await VoucherService.getVoucherByVoucherNo(voucherNo);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Voucher retived Successfully",
      data: result,
    });
  }
);

const getVoucherbyid = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await VoucherService.getVoucherByid(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Voucher retived Successfully",
    data: result,
  });
});

const getDailyReport = catchAsync(async (req: Request, res: Response) => {
  const date = req.query.date as string;
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
