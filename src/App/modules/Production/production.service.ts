import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createProduction = async (payload: any) => {
  const addProduction = await prisma.$transaction(async (tx) => {
    const isProductExisted = await tx.product.findFirst({
      where: {
        id: payload.productId,
        isDeleted: false,
      },
    });

    if (!isProductExisted) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Product not found");
    }

    const createProduction = await tx.production.create({
      data: {
        voucherNo: payload.voucherNo,
        batchNo: payload.batchNo,
        date: new Date(payload.date),
        productId: payload.productId,
      },
    });

    const productInventory = {
      productId: payload.productId,
      productionId: createProduction.id,
      date: new Date(payload.date),
      quantityAdd: payload.productQuantity,
      unitPrice: payload.unitCost,
      debitAmount: payload.amount,
    };

    const rowMaterialInventory = payload.rawMaterials.map(
      (item: {
        rawId: number;
        unitPrice: number;
        amount: number;
        quantity: number;
      }) => ({
        rawId: item.rawId,
        productionId: createProduction.id,
        date: new Date(payload.date),
        quantityLess: item.quantity,
        unitPrice: item.unitPrice,
        creditAmount: item.amount,
      }),
    );

    const inventoryItems = [...rowMaterialInventory, productInventory];

    await tx.inventory.createMany({
      data: inventoryItems,
    });

    return createProduction;
  });

  const getCreatedProduction = await prisma.production.findUnique({
    where: {
      id: addProduction.id,
    },
    include: {
      inventories: {
        include: {
          product: true,
          raWMaterial: true,
        },
      },
    },
  });

  return getCreatedProduction;
};

const getProduction = async () => {
  const result = await prisma.production.findMany({
    include: {
      product: true,
      inventories: {
        include: {
          product: true,
          raWMaterial: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return result;
};

const getProductionById = async (id: number) => {
  const result = await prisma.production.findUnique({
    where: {
      id: id,
    },
    include: {
      product: true,
      inventories: {
        include: {
          product: true,
          raWMaterial: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  return result;
};

const updateProduction = async (id: number, payload: any) => {
  const isExist = await prisma.production.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  const result = await prisma.production.update({
    where: {
      id: id,
    },
    data: {
      voucherNo: payload.voucherNo,
      batchNo: payload.batchNo,
      date: payload.date ? new Date(payload.date) : undefined,
      productId: payload.productId,
    },
  });

  return result;
};

const deleteProduction = async (id: number) => {
  const isExist = await prisma.production.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventory.deleteMany({
      where: { productionId: isExist.id },
    });

    await tx.production.delete({
      where: { id: id },
    });
  });

  return isExist;
};

export const ProductionService = {
  createProduction,
  getProduction,
  getProductionById,
  updateProduction,
  deleteProduction,
};
