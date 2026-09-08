"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createProduct_service_1 = require("./createProduct.service");
const createProductFromRowMaterial = (0, catchAsync_1.default)(async (req, res) => {
    const result = await createProduct_service_1.CreateProductServices.createProductInfo(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "RowMaterial convented to product successfully",
        data: result,
    });
});
exports.CreateProductControllers = {
    createProductFromRowMaterial,
};
