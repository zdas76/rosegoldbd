
import { Unit } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createUnit = async (payload: Unit) => {
  const isExist = await prisma.unit.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name already use");
  }

  const result = await prisma.unit.create({
    data: payload,
  });

  return result;
};

const getAllUnit = async () => {
  const result = await prisma.unit.findMany();
  return result;
};

const getUnitById = async (id: number) => {
  const result = await prisma.unit.findFirst({
    where: {
      id: id,
    },
  });
  return result;
};

const updateUnit = async (id: number, payload: Unit) => {
  const result = await prisma.unit.update({
    where: {
      id: id,
    },
    data: {
      name: payload.name,
    },
  });
  return result;
};

// delete unit
const deleteUnit = async (id: number) => {
  const existUnit = await prisma.unit.findUnique({
    where: {
      id: id
    }
  });

  if (!existUnit) {
    throw new AppError(StatusCodes.NOT_FOUND, "Unit not found");
  }
  const result = await prisma.unit.delete({
    where: {
      id: id
    }
  });
  return result;
}


export const UnitService = {
  createUnit,
  getAllUnit,
  getUnitById,
  updateUnit,
  deleteUnit
};
