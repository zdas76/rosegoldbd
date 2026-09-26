import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProductionExpItemService } from "./ProductionExpItem.service";
import { StatusCodes } from "http-status-codes";

const createProductionExpItem = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.body, "============ req body expense");
    const result = await ProductionExpItemService.createProductionExpItem(
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Production expense item created successfully",
      data: result,
    });
  }
);

const createProductionExpItemsMany = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductionExpItemService.createProductionExpItemsMany(
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Production expense items created successfully",
      data: result,
    });
  }
);

const getAllProductionExpItems = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductionExpItemService.getAllProductionExpItems();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense items retrieved successfully",
      data: result,
    });
  }
);

const getProductionExpItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result = await ProductionExpItemService.getProductionExpItemById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense item retrieved successfully",
      data: result,
    });
  }
);

const updateProductionExpItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result = await ProductionExpItemService.updateProductionExpItemById(
      id,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense item updated successfully",
      data: result,
    });
  }
);

const deleteProductionExpItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result = await ProductionExpItemService.deleteProductionExpItemById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense item deleted successfully",
      data: result,
    });
  }
);

export const ProductionExpItemControllers = {
  createProductionExpItem,
  createProductionExpItemsMany,
  getAllProductionExpItems,
  getProductionExpItemById,
  updateProductionExpItemById,
  deleteProductionExpItemById,
};
