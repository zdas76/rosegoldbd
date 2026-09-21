import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ProductIngradientService } from "./productIngradient.service";

const createProductIngradient = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductIngradientService.createProductIngradient(
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Product ingradient created successfully",
      data: result,
    });
  }
);

const getAllProductIngradients = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      productId: req.query.productId
        ? parseInt(req.query.productId as string)
        : undefined,
    };
    const result =
      await ProductIngradientService.getAllProductIngradients(filters);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product ingradients retrieved successfully",
      data: result,
    });
  }
);

const getProductIngradientById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductIngradientService.getProductIngradientById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product ingradient retrieved successfully",
      data: result,
    });
  }
);

const getProductIngradientByProductId = catchAsync(
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId as string);
    const result =
      await ProductIngradientService.getProductIngradientByProductId(productId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product ingradient retrieved successfully",
      data: result,
    });
  }
);

const updateProductIngradient = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductIngradientService.updateProductIngradientById(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product ingradient updated successfully",
      data: result,
    });
  }
);

const deleteProductIngradient = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const result =
      await ProductIngradientService.deleteProductIngradientById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product ingradient deleted successfully",
      data: result,
    });
  }
);

export const ProductIngradientControllers = {
  createProductIngradient,
  getAllProductIngradients,
  getProductIngradientById,
  getProductIngradientByProductId,
  updateProductIngradient,
  deleteProductIngradient,
};
