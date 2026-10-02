import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ProductionService } from "./production.service";

const createProduction = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
    ? Number(req.params.id)
    : req.body?.id
    ? Number(req.body.id)
    : 0;
  const result = await ProductionService.createProduction(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: id ? "Production updated successfully" : "Production created successfully",
    data: result,
  });
});

const getProduction = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductionService.getProduction();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Production records retrieved successfully",
    data: result,
  });
});

const getProductionById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ProductionService.getProductionById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Production record retrieved successfully",
    data: result,
  });
});

const deleteProduction = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await ProductionService.deleteProduction(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Production deleted successfully",
    data: null,
  });
});

export const ProductionController = {
  createProduction,
  getProduction,
  getProductionById,
  deleteProduction,
};
