"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const unit_service_1 = require("./unit.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createUnit = (0, catchAsync_1.default)(async (req, res) => {
    const result = await unit_service_1.UnitService.createUnit(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Unit create Successfully",
        data: result,
    });
});
const getAllUnit = (0, catchAsync_1.default)(async (req, res) => {
    const result = await unit_service_1.UnitService.getAllUnit();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Units retrive Successfully",
        data: result,
    });
});
const getUnitById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await unit_service_1.UnitService.getUnitById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Unit retrive Successfully",
        data: result,
    });
});
const updateUnit = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await unit_service_1.UnitService.updateUnit(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Unit updated Successfully",
        data: result,
    });
});
// delete unit controller
const deleteUnit = (0, catchAsync_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    await unit_service_1.UnitService.deleteUnit(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Unit is deleted Successfully`,
        data: null,
    });
});
exports.UnitControllers = {
    createUnit,
    getAllUnit,
    getUnitById,
    updateUnit,
    deleteUnit
};
