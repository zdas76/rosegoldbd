import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { UserSearchAbleFields } from "./employee.constant";
import { Status } from "../../../generated/prisma/client";
const creatEmployeeToDB = async (req) => {
    const createEmployee = await prisma.employee.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            nid: req.body.nid,
            dob: req.body.dob,
            workingPlase: req.body.workingPlase,
            photo: req.body.photo,
            address: req.body.address,
            mobile: req.body.mobile,
        },
    });
    return createEmployee;
};
const getAllemployee = async (params, paginat) => {
    const { page, limit, skip } = paginationHelper.Pagination(paginat);
    const { searchTerm, ...filterData } = params;
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: UserSearchAbleFields.map((field) => ({
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
    const wehreConditions = andCondition.length > 0 ? { AND: andCondition } : { status: Status.ACTIVE };
    const result = await prisma.employee.findMany({
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
    const total = await prisma.employee.count({
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
    const result = await prisma.employee.findFirst({
        where: {
            id: id,
            status: Status.ACTIVE,
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
const updateEmployeeById = async (id, payload) => {
    const result = await prisma.employee.update({
        where: {
            id: id,
            status: Status.ACTIVE,
        },
        data: payload,
    });
    return result;
};
const deleteEmployeeById = async (id) => {
    const result = await prisma.employee.update({
        where: {
            id: id,
            status: Status.ACTIVE,
        },
        data: {
            status: Status.DELETED,
        },
    });
    return result;
};
export const EmployeeService = {
    creatEmployeeToDB,
    getAllemployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById,
};
