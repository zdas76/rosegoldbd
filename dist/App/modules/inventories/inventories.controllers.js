"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const inventories_service_1 = require("./inventories.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const getnventory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await inventories_service_1.InventoryService.getInventory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const getInventoryById = (0, catchAsync_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const result = await inventories_service_1.InventoryService.getInventoryById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const updateInventory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await inventories_service_1.InventoryService.getInventory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const deleteInventory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await inventories_service_1.InventoryService.getInventory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result,
    });
});
const getInventoryAggigetValue = (0, catchAsync_1.default)(async (req, res) => {
    const result = await inventories_service_1.InventoryService.getInventoryAggValueById(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parties retrived Successfully",
        data: result[0],
    });
});
exports.InventoryControllers = {
    getnventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    getInventoryAggigetValue,
};
