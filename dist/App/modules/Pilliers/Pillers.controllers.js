"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PillersControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const Pillers_service_1 = require("./Pillers.service");
const createPillers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await Pillers_service_1.PillersService.createPliersItemIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Accounts Head Create Successfuly",
        data: result,
    });
});
const getPillers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await Pillers_service_1.PillersService.getAllPillerItem();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Accounts Head retrived Successfuly",
        data: result,
    });
});
exports.PillersControllers = {
    createPillers,
    getPillers,
};
