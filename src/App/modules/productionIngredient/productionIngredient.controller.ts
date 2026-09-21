import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ProductionIngredientService } from "./productionIngredient.service";

const createProductionIngredient = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await ProductionIngredientService.createProductionIngredient(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Production ingredient created successfully",
      data: result,
    });
  }
);

const getAllProductionIngredients = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      type: req.query.type as any,
    };
    const result =
      await ProductionIngredientService.getAllProductionIngredients(filters);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production ingredients retrieved successfully",
      data: result,
    });
  }
);

const getProductionIngredientById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductionIngredientService.getProductionIngredientById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production ingredient retrieved successfully",
      data: result,
    });
  }
);

const updateProductionIngredient = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductionIngredientService.updateProductionIngredientById(
        id,
        req.body
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production ingredient updated successfully",
      data: result,
    });
  }
);

const deleteProductionIngredient = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductionIngredientService.deleteProductionIngredientById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Production ingredient deleted successfully",
      data: result,
    });
  }
);

export const ProductionIngredientControllers = {
  createProductionIngredient,
  getAllProductionIngredients,
  getProductionIngredientById,
  updateProductionIngredient,
  deleteProductionIngredient,
};
