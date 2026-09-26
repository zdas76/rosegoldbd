import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TProductionExpItem } from "./ProductionExpItem.types";

const createProductionExpItem = async (payload: TProductionExpItem) => {
  if (!payload.expItemName || !payload.expItemName.trim()) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Expense item name is required");
  }

  const isExist = await prisma.productionExpenseItem.findFirst({
    where: {
      expItemName: payload.expItemName.trim(),
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This expense item already exists");
  }

  const result = await prisma.productionExpenseItem.create({
    data: {
      expItemName: payload.expItemName.trim(),
      // expDuration:
      //   payload.expDuration !== undefined ? Number(payload.expDuration) : 0,
      unitRate: payload.unitRate !== undefined ? Number(payload.unitRate) : 0,
    },
  });

  return result;
};

const createProductionExpItemsMany = async (
  payloads: TProductionExpItem[]
) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "At least one expense item is required"
    );
  }

  const names = payloads
    .map((p) => p?.expItemName?.trim())
    .filter((name): name is string => Boolean(name));

  const existing = await prisma.productionExpenseItem.findMany({
    where: {
      expItemName: { in: names },
    },
    select: { expItemName: true },
  });

  if (existing.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `These expense items already exist: ${existing
        .map((e) => e.expItemName)
        .join(", ")}`
    );
  }

  const result = await prisma.$transaction(
    payloads.map((item) =>
      prisma.productionExpenseItem.create({
        data: {
          expItemName: item.expItemName.trim(),
          // expDuration:
          //   item.expDuration !== undefined ? Number(item.expDuration) : 0,
          unitRate: item.unitRate !== undefined ? Number(item.unitRate) : 0,
        },
      })
    )
  );

  return result;
};

const getAllProductionExpItems = async () => {
  const result = await prisma.productionExpenseItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getProductionExpItemById = async (id: number) => {
  const result = await prisma.productionExpenseItem.findUnique({
    where: { id },
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Expense item not found");
  }

  return result;
};

const updateProductionExpItemById = async (
  id: number,
  payload: Partial<TProductionExpItem>
) => {
  const isExist = await prisma.productionExpenseItem.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Expense item not found");
  }

  if (
    payload.expItemName &&
    payload.expItemName.trim() !== isExist.expItemName
  ) {
    const duplicate = await prisma.productionExpenseItem.findFirst({
      where: {
        expItemName: payload.expItemName.trim(),
        id: { not: id },
      },
    });

    if (duplicate) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Another expense item already has this name"
      );
    }
  }

  const result = await prisma.productionExpenseItem.update({
    where: { id },
    data: {
      expItemName: payload.expItemName ? payload.expItemName.trim() : undefined,
      // expDuration:
      //   payload.expDuration !== undefined
      //     ? Number(payload.expDuration)
      //     : undefined,
      unitRate:
        payload.unitRate !== undefined ? Number(payload.unitRate) : undefined,
    },
  });

  return result;
};

const deleteProductionExpItemById = async (id: number) => {
  const isExist = await prisma.productionExpenseItem.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Expense item not found");
  }

  const result = await prisma.productionExpenseItem.delete({
    where: { id },
  });

  return result;
};

export const ProductionExpItemService = {
  createProductionExpItem,
  createProductionExpItemsMany,
  getAllProductionExpItems,
  getProductionExpItemById,
  updateProductionExpItemById,
  deleteProductionExpItemById,
};
