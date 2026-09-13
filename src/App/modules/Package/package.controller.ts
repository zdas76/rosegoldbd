import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PackageService } from "./package.service";

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.createPackage(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package created successfully",
    data: result,
  });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackages();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Packages retrieved successfully",
    data: result,
  });
});

const getPackageById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const result = await PackageService.getPackageById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package retrieved successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const result = await PackageService.updatePackage(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package updated successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await PackageService.deletePackage(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Package deleted successfully",
    data: null,
  });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
