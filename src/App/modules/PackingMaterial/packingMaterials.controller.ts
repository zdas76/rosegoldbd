import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PackingMaterialsService } from "./packingMaterials.service";
import { StatusCodes } from "http-status-codes";

const createPackingMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await PackingMaterialsService.createPackingMaterial(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Packing material created successfully",
    data: result,
  });
});

const createPackingMaterialsMany = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PackingMaterialsService.createPackingMaterialsMany(
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Packing materials created successfully",
      data: result,
    });
  }
);

const getAllPackingMaterial = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    search: req.query.search as string | undefined,
  };
  const result = await PackingMaterialsService.getAllPackingMaterial(filters);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Packing materials retrieved successfully",
    data: result,
  });
});

const getPackingMaterialById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result = await PackingMaterialsService.getPackingMaterialById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Packing material retrieved successfully",
      data: result,
    });
  }
);

const updatePackingMaterialById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result = await PackingMaterialsService.updatePackingMaterial(
      id,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Packing material updated successfully",
      data: result,
    });
  }
);

const deletePackingMaterialById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result = await PackingMaterialsService.deletePackingMaterial(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Packing material deleted successfully",
      data: result,
    });
  }
);

export const PackingMaterialControllers = {
  createPackingMaterial,
  createPackingMaterialsMany,
  getAllPackingMaterial,
  getPackingMaterialById,
  updatePackingMaterialById,
  deletePackingMaterialById,
};
