"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const product_service_1 = require("./product.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const result = await product_service_1.ProductService.createProduct(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product create successfully",
        data: result,
    });
});
const getAllProduct = (0, catchAsync_1.default)(async (req, res) => {
    const result = await product_service_1.ProductService.gerProduct();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Producties retrives successfully",
        data: result,
    });
});
const getProductById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await product_service_1.ProductService.gerProductById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product retrives successfully",
        data: result,
    });
});
const updateProductById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await product_service_1.ProductService.updateProductById(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product update successfully",
        data: result,
    });
});
const deleteProductById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await product_service_1.ProductService.deleteProductById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product delete successfully",
        data: result,
    });
});
exports.ProductControllers = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProductById,
    deleteProductById,
};
