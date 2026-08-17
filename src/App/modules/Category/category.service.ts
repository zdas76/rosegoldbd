import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { Category } from "../../../../generated/prisma";

const createCategoryToDB = async (payLoad: Category) => {
  const category = await prisma.category.findFirst({
    where: {
      categoryName: payLoad.categoryName,
    },
  });

  if (category) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.category.create({
    data: {
      categoryName: payLoad.categoryName,
    },
  });

  return result;
};

const getCategory = async (): Promise<Category[]> => {
  const result = await prisma.category.findMany({});

  return result;
};

const categoryUpdate = async (id: number, payLoad: Category) => {

  const category = await prisma.category.findFirst({
    where: {
      id: id,
    },
  });

  if (!category) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      categoryName: payLoad.categoryName,
    },
  });

  return result;
};

const getCategorybyId = async (payLoad: Category) => {
  const result = await prisma.category.findFirstOrThrow({
    where: {
      categoryName: payLoad.categoryName,
    },
  });

  return result;
};

export const CagetoryService = {
  createCategoryToDB,
  getCategory,
  categoryUpdate,
  getCategorybyId,
};
