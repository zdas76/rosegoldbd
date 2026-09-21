import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProductionExpenseItemService } from "./productionExpenseItem.service";
import { StatusCodes } from "http-status-codes";

const createProductionExpenseItem = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await ProductionExpenseItemService.createProductionExpenseItem(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Production expense item created successfully",
      data: result,
    });
  }
);

const createProductionExpenseItemsMany = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await ProductionExpenseItemService.createProductionExpenseItemsMany(
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

const getAllProductionExpenseItems = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      search: req.query.search as string | undefined,
    };
    const result =
      await ProductionExpenseItemService.getAllProductionExpenseItems(filters);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense items retrieved successfully",
      data: result,
    });
  }
);

const getProductionExpenseItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductionExpenseItemService.getProductionExpenseItemById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense item retrieved successfully",
      data: result,
    });
  }
);

const updateProductionExpenseItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductionExpenseItemService.updateProductionExpenseItemById(
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

const deleteProductionExpenseItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductionExpenseItemService.deleteProductionExpenseItemById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production expense item deleted successfully",
      data: result,
    });
  }
);

export const ProductionExpenseItemControllers = {
  createProductionExpenseItem,
  createProductionExpenseItemsMany,
  getAllProductionExpenseItems,
  getProductionExpenseItemById,
  updateProductionExpenseItemById,
  deleteProductionExpenseItemById,
};
