
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { Request } from "express";
import { UserSearchAbleFields } from "./employee.constant";
import { Employee, Prisma, Status } from "../../../generated/prisma/client";


const creatEmployeeToDB = async (req: Request): Promise<Partial<Employee>> => {


  const createEmployee = await prisma.employee.create({
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

const getAllemployee = async (params: any, paginat: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.EmployeeWhereInput[] = [];

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

  const wehreConditions: Prisma.EmployeeWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : { status: Status.ACTIVE };

  const result = await prisma.employee.findMany({
    where: wehreConditions,
    skip,
    take: limit,
    orderBy:
      paginat.sortBy && paginat.sortOrder
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

const getEmployeeById = async (id: number) => {
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

const updateEmployeeById = async (
  id: number,
  payload: Partial<Employee>,
  file?: Express.Multer.File
) => {
  const result = await prisma.employee.update({
    where: {
      id: id,
      status: Status.ACTIVE,
    },
    data: {
      ...payload,
      ...(file && { photo: `/uploads/${file.filename}` }),
    },
  });

  return result;
};

const deleteEmployeeById = async (id: number) => {

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
