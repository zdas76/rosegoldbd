
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TcreateProduct } from "./product.type";
import { Product } from "../../../../generated/prisma";

const createProduct = async (payload: TcreateProduct) => {

  const isExist = await prisma.product.findFirst({
    where: {
      name: payload.name,
      isDeleted: false,
    },
  });

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This product is already existed"
    );
  }
  const result = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      unitId: payload.unitId,
      subCategoryId: payload.subCategoryId,
      minPrice: payload.minPrice || 0,
      size: payload.size || "",
      openingDate: payload.initialStock.date,
      amount: Number(payload.initialStock.amount),
      quantity: payload.initialStock.quantity,
      unitPrice: payload.initialStock.unitPrice,
      inventory: {
        create: {
          date: payload.initialStock.date,
          unitPrice: payload.initialStock.unitPrice,
          quantityAdd: payload.initialStock.quantity,
          debitAmount: Number(payload.initialStock.amount),
          isClosing: true,
        },
      },
    },
  });

  return result;
};

const gerProduct = async () => {
  const result = await prisma.product.findMany({
    include: {
      unit: {
        select: {
          name: true,
        },
      },
      subCategory: {
        select: {
          subCategoryName: true,
        },
      },
    },
  });

  return result;
};

const gerProductById = async (id: number) => {
  const result = await prisma.product.findFirst({
    where: {
      id: id,
    },
  });

  return result;
};

const updateProductById = async (id: number, payload: Partial<Product>) => {
  const isExist = await prisma.product.findFirst({
    where: { id: id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No product found");
  }

  const result = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      name: payload.name,
      description: payload.description,
      unitId: payload.unitId,
      subCategoryId: payload.subCategoryId,
      minPrice: payload.minPrice || 0,
      size: payload.size || "",
    },
  });

  return result;
};

const deleteProductById = async (id: number) => {
  const isExist = await prisma.product.findFirst({
    where: { id: id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No product found");
  }

  const result = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
  gerProduct,
  gerProductById,
  updateProductById,
  deleteProductById,
};
