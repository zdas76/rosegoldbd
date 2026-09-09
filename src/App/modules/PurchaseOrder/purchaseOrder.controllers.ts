import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PurchaseOrderService } from "./purchaseOrder.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { purchaseOrderFilterFields } from "./purchaseOrder.constant";

const createPurchaseOrder = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PurchaseOrderService.createPurchaseOrder(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Purchase Order create successfully",
      data: result,
    });
  }
);

const getAllPurchaseOrders = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, purchaseOrderFilterFields);
    const paginat = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await PurchaseOrderService.getAllPurchaseOrders(
      filters,
      paginat
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Purchase Orders retrived Successfully",
      data: result,
    });
  }
);

const getPurchaseOrderById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    const result = await PurchaseOrderService.getPurchaseOrderById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Purchase Order retrived Successfully",
      data: result,
    });
  }
);

const updatePurchaseOrderById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    const result = await PurchaseOrderService.updatePurchaseOrderById(
      id,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Purchase Order Update Successfully",
      data: result,
    });
  }
);

const deletePurchaseOrderById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    const result = await PurchaseOrderService.deletePurchaseOrderById(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Purchase Order Deleted Successfully",
      data: result,
    });
  }
);

export const PurchaseOrderControllers = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderById,
  deletePurchaseOrderById,
};