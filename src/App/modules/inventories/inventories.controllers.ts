import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import { InventoryService } from "./inventories.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getnventory = catchAsync(async (req: Request, res: Response) => {
  const result = await InventoryService.getInventory();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parties retrived Successfully",
    data: result,
  });
});

const getInventoryById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await InventoryService.getInventoryById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parties retrived Successfully",
    data: result,
  });
});

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  const result = await InventoryService.getInventory();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parties retrived Successfully",
    data: result,
  });
});

const deleteInventory = catchAsync(async (req: Request, res: Response) => {
  const result = await InventoryService.getInventory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parties retrived Successfully",
    data: result,
  });
});

const getInventoryAggigetValue = catchAsync(
  async (req: Request, res: Response) => {
    const result: any = await InventoryService.getInventoryAggValueById(
      req.query
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Parties retrived Successfully",
      data: result[0],
    });
  }
);
// get last rate of raw material
const getLastRawMaterialRate = catchAsync(
  async (req: Request, res: Response) => {
    const ids = JSON.parse(req.query.ids as string);
    const result: any = await InventoryService.getLastRawMaterialRate(ids);
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Last rate of raw material retrived Successfully",
      data: result,
    });
  });

export const InventoryControllers = {
  getnventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getInventoryAggigetValue,
  getLastRawMaterialRate
};
