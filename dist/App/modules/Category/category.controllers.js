"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const category_service_1 = require("./category.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CagetoryService.createCategoryToDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category create Successfully",
        data: result,
    });
});
const getCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CagetoryService.getCategory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category retrived Successfully",
        data: result,
    });
});
const getCategoryById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CagetoryService.getCategorybyId(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category retrived Successfully",
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await category_service_1.CagetoryService.categoryUpdate(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category updated Successfully",
        data: result,
    });
});
exports.CategoryControllers = {
    createCategory,
    getCategory,
    updateCategory,
    getCategoryById,
};
