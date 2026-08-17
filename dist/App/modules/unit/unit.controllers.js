import catchAsync from "../../../shared/catchAsync";
import { UnitService } from "./unit.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
const createUnit = catchAsync(async (req, res) => {
    const result = await UnitService.createUnit(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Unit create Successfully",
        data: result,
    });
});
const getAllUnit = catchAsync(async (req, res) => {
    const result = await UnitService.getAllUnit();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Units retrive Successfully",
        data: result,
    });
});
const getUnitById = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await UnitService.getUnitById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Unit retrive Successfully",
        data: result,
    });
});
const updateUnit = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await UnitService.updateUnit(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Unit updated Successfully",
        data: result,
    });
});
// delete unit controller
const deleteUnit = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    await UnitService.deleteUnit(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Unit is deleted Successfully`,
        data: null,
    });
});
export const UnitControllers = {
    createUnit,
    getAllUnit,
    getUnitById,
    updateUnit,
    deleteUnit
};
