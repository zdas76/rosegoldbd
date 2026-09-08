"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const handelZorError_1 = __importDefault(require("../errors/handelZorError"));
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    if (err instanceof zod_1.ZodError) {
        const simplifedError = (0, handelZorError_1.default)(err);
        statusCode = simplifedError?.statusCode;
        message = simplifedError?.message;
        error = simplifedError.errorSources;
    }
    else if (err.code === "P2025") {
        message = "Validation Error";
        error = err.message;
    }
    else if (err.code === "P2002") {
        message = "Duplicate error";
        error = err.meta;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err?.statusCode;
        message = err?.message;
        error = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err?.message;
        error = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
