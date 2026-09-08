"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawMaterialControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const raw_service_1 = require("./raw.service");
const http_status_codes_1 = require("http-status-codes");
const createRawMaterial = (0, catchAsync_1.default)(async (req, res) => {
    const result = await raw_service_1.RowMaterialsService.createRawMaterial(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RawMaterial create successfully",
        data: result,
    });
});
const createRawMaterialsMany = (0, catchAsync_1.default)(async (req, res) => {
    const result = await raw_service_1.RowMaterialsService.createRawMaterialsMany(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RawMaterials create successfully",
        data: result,
    });
});
const getAllRawMaterial = (0, catchAsync_1.default)(async (req, res) => {
    const result = await raw_service_1.RowMaterialsService.getAllRawMaterial();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RawMaterialies retrives successfully",
        data: result,
    });
});
const getRawMaterialById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await raw_service_1.RowMaterialsService.getRawMaterialById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RawMaterial retrives successfully",
        data: result,
    });
});
const updateRawMaterialById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await raw_service_1.RowMaterialsService.updateRawMaterial(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RawMaterial update successfully",
        data: result,
    });
});
const deleteRawMaterialById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await raw_service_1.RowMaterialsService.deleteRawMaterial(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RawMaterial delete successfully",
        data: result,
    });
});
exports.RawMaterialControllers = {
    createRawMaterial,
    createRawMaterialsMany,
    getAllRawMaterial,
    getRawMaterialById,
    updateRawMaterialById,
    deleteRawMaterialById,
};
