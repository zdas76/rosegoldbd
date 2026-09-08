"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../../helpars/paginationHelpers");
const employee_constant_1 = require("./employee.constant");
const client_1 = require("../../../generated/prisma/client");
const creatEmployeeToDB = async (req) => {
    const createEmployee = await prisma_1.default.employee.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            nid: req.body.nid,
            dob: req.body.dob,
            workingPlase: req.body.workingPlase,
            photo: req.file ? `/uploads/${req.file.filename}` : req.body.photo,
            address: req.body.address,
            mobile: req.body.mobile,
        },
    });
    return createEmployee;
};
const getAllemployee = async (params, paginat) => {
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.Pagination(paginat);
    const { searchTerm, ...filterData } = params;
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: employee_constant_1.UserSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const wehreConditions = andCondition.length > 0 ? { AND: andCondition } : { status: client_1.Status.ACTIVE };
    const result = await prisma_1.default.employee.findMany({
        where: wehreConditions,
        skip,
        take: limit,
        orderBy: paginat.sortBy && paginat.sortOrder
            ? {
                [paginat.sortBy]: paginat.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            name: true,
            nid: true,
            dob: true,
            workingPlase: true,
            photo: true,
            address: true,
            mobile: true,
            status: true,
        },
    });
    const total = await prisma_1.default.employee.count({
        where: wehreConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getEmployeeById = async (id) => {
    const result = await prisma_1.default.employee.findFirst({
        where: {
            id: id,
            status: client_1.Status.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            name: true,
            nid: true,
            dob: true,
            workingPlase: true,
            photo: true,
            address: true,
            mobile: true,
            status: true,
        },
    });
    return result;
};
const updateEmployeeById = async (id, payload, file) => {
    const result = await prisma_1.default.employee.update({
        where: {
            id: id,
            status: client_1.Status.ACTIVE,
        },
        data: {
            ...payload,
            ...(file && { photo: `/uploads/${file.filename}` }),
        },
    });
    return result;
};
const deleteEmployeeById = async (id) => {
    const result = await prisma_1.default.employee.update({
        where: {
            id: id,
            status: client_1.Status.ACTIVE,
        },
        data: {
            status: client_1.Status.DELETED,
        },
    });
    return result;
};
exports.EmployeeService = {
    creatEmployeeToDB,
    getAllemployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById,
};
