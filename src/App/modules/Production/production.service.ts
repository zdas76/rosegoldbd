
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { ItemType, VoucherType } from "@prisma/client";

const createProduction = async (payload: any) => {

  const addProduction = await prisma.$transaction(async (tx) => {

    const createTransaction = await tx.transactionInfo.create({
      data: {
        voucherNo: payload.voucherNo,
        invoiceNo: payload.invoiceNo || "",
        voucherType: VoucherType.CREATEPRODUCT,
      },
    });

    const isProductExisted = await tx.product.findFirst({
      where: {
        id: payload.product.productId,
        itemType: ItemType.PRODUCT,
        isDeleted: false,
      },
    });

    if (!isProductExisted) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Product not found");
    }

    const productInventory = {
      productId: isProductExisted.id,
      date: new Date(payload.date),
      transactionId: createTransaction.id,
      quantityAdd: payload.product.quantity,
      unitPrice: payload.product.unitcost,
      debitAmount: payload.product.amount,
    };

    const rowMaterialInventory = payload.rawMaterials.map(
      (item: {
        rawMaterialsId: number;
        rawUnitprice: number;
        amount: number;
        quantity: number;
      }) => ({
        rawId: item.rawMaterialsId,
        transactionId: createTransaction.id,
        date: new Date(payload.date),
        quantityLess: item.quantity,
        unitPrice: item.rawUnitprice,
        creditAmount: item.amount,
      })
    );

    const inventoryItems = [...rowMaterialInventory, productInventory];

    await tx.inventory.createMany({
      data: inventoryItems,
    });

    const costItemsJournal = payload.expenses.map((item: any) => ({
      transectionId: createTransaction.id,
      accountsItemId: item.accountsItemId,
      date: new Date(payload.date),
      debitAmount: item.amount,
      narration: item.narration || "",
    }));

    await tx.journal.createMany({
      data: costItemsJournal,
    });

    return createTransaction;
  });

  const getCreatedProduction = await prisma.transactionInfo.findFirst({
    where: {
      id: addProduction.id,
    },
    include: {
      journal: true,
      inventory: {
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
  const result = await prisma.transactionInfo.findMany({
    where: {
      voucherType: VoucherType.CREATEPRODUCT,
    },
    include: {
      party: true,
      bankTransaction: true,
      journal: {
        include: {
          accountsItem: true,
        },
      },
      inventory: {
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
  const result = await prisma.transactionInfo.findFirst({
    where: {
      id: id,
      voucherType: VoucherType.CREATEPRODUCT,
    },
    include: {
      party: true,
      bankTransaction: true,
      journal: {
        include: {
          accountsItem: true,
        },
      },
      inventory: {
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
  const isExist = await prisma.transactionInfo.findFirst({
    where: {
      id: id,
      voucherType: VoucherType.CREATEPRODUCT,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  const result = await prisma.transactionInfo.update({
    where: {
      id: id,
    },
    data: {
      voucherNo: payload.voucherNo,
      invoiceNo: payload.invoiceNo,
      date: payload.date ? new Date(payload.date) : undefined,
    },
  });

  return result;
};

const deleteProduction = async (id: number) => {
  const isExist = await prisma.transactionInfo.findFirst({
    where: {
      id: id,
      voucherType: VoucherType.CREATEPRODUCT,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventory.deleteMany({
      where: { transactionId: id },
    });

    await tx.journal.deleteMany({
      where: { transectionId: id },
    });

    await tx.bankTransaction.deleteMany({
      where: { transectionId: id },
    });

    await tx.transactionInfo.delete({
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
