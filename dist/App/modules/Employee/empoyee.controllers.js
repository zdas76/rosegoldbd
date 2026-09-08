"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const employee_service_1 = require("./employee.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const employee_constant_1 = require("./employee.constant");
const createEmployee = (0, catchAsync_1.default)(async (req, res) => {
    console.log("req.body", req.body);
    const result = await employee_service_1.EmployeeService.creatEmployeeToDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Employee create successfully",
        data: result,
    });
});
const getEmployee = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, employee_constant_1.UserfiltersFields);
    const paginat = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await employee_service_1.EmployeeService.getAllemployee(filters, paginat);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Employees retrived Successfully",
        data: result,
    });
});
const getEmployeeById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await employee_service_1.EmployeeService.getEmployeeById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Employee retrived Successfully",
        data: result,
    });
});
const updateEmployeeById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await employee_service_1.EmployeeService.updateEmployeeById(id, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Employee retrived Successfully",
        data: result,
    });
});
const deleteEmployeeById = (0, catchAsync_1.default)(async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await employee_service_1.EmployeeService.deleteEmployeeById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Employee deleted Successfully",
        data: result,
    });
});
exports.EmployeeControllers = {
    getEmployee,
    getEmployeeById,
    updateEmployeeById,
    createEmployee,
    deleteEmployeeById,
};
