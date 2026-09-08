"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const subCategory_service_1 = require("./subCategory.service");
const createSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subCategory_service_1.SubCagetoryService.createSubCategoryToDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category create Successfully",
        data: result,
    });
});
const getSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subCategory_service_1.SubCagetoryService.getSubCategory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category retrived Successfully",
        data: result,
    });
});
const getSubCategoryById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subCategory_service_1.SubCagetoryService.getCategorybyId(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category retrived Successfully",
        data: result,
    });
});
const updateSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await subCategory_service_1.SubCagetoryService.subCategoryUpdate(req.body, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result.subCategoryName} is updated Successfully`,
        data: result,
    });
});
const deleteSubCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = Number(req.params.id);
    const result = await subCategory_service_1.SubCagetoryService.deleteSubService(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `SubCategory is deleted Successfully`,
        data: result,
    });
});
exports.SubCategoryControllers = {
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    getSubCategoryById,
    deleteSubCategory
};
