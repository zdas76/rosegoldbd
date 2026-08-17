import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { SubCategory } from "../../../../generated/prisma";

const createSubCategoryToDB = async (payLoad: SubCategory) => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      subCategoryName: payLoad.subCategoryName,
    },
  });

  if (subCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.subCategory.create({
    data: {
      subCategoryName: payLoad.subCategoryName,
      categoryId: payLoad.categoryId,
    },
  });

  return result;
};

const getSubCategory = async (): Promise<SubCategory[] | SubCategory> => {
  const result = await prisma.subCategory.findMany({
    include: {
      category: true,
    },
  });

  return result;
};

const subCategoryUpdate = async (payLoad: Partial<SubCategory>, id: number) => {

  const subCategory = await prisma.subCategory.findFirst({
    where: {
      id: id,
    },
  });

  if (!subCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Field is not founed");
  }

  const result = await prisma.subCategory.update({
    where: {
      id: subCategory.id,
    },
    data: {
      subCategoryName: payLoad.subCategoryName,
    },
  });
  return result;
};

const getCategorybyId = async (payLoad: SubCategory) => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      id: payLoad.id,
    },
  });

  if (!subCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }
  const result = await prisma.subCategory.findFirstOrThrow({
    where: {
      id: payLoad.id,
    },
  });

  return result;
};
// delete subcategory
const deleteSubService = async (id: number) => {
  const deleteResult = await prisma.subCategory.delete({
    where: {
      id: Number(id),
    }
  });
  return deleteResult;
};


export const SubCagetoryService = {
  createSubCategoryToDB,
  getSubCategory,
  subCategoryUpdate,
  getCategorybyId,
  deleteSubService
};
