import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ProductionService } from "./production.service";
const createProduction = catchAsync(async (req, res) => {
    const result = await ProductionService.createProduction(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Production created successfully",
        data: result,
    });
});
const getProduction = catchAsync(async (req, res) => {
    const result = await ProductionService.getProduction();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Production records retrieved successfully",
        data: result,
    });
});
const updateProduction = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await ProductionService.updateProduction(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Production updated successfully",
        data: result,
    });
});
const deleteProduction = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
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
    updateProduction,
    deleteProduction,
};
