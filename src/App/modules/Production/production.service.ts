import { Department, Status, VoucherType } from "@prisma/client";
import { GenerateVoucherNumber } from "../../../helpars/generateVoucherNumber";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { Production } from "./productionTypes";

const createProduction = async (
  id: number | undefined,
  payload: Production,
) => {
  const isProductExisted = await prisma.product.findFirst({
    where: {
      id: payload.productinfo.productId,
      isDeleted: false,
    },
  });

  if (!isProductExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product not found");
  }

  const addProduction = await prisma.$transaction(async (tx) => {
    const VoucherNo = await GenerateVoucherNumber("PROD");
    const transactionInfo = await tx.transactionInfo.upsert({
      where: {
        id,
      },
      update: {
        date: new Date(payload.date),
      },
      create: {
        voucherNo: VoucherNo!,
        batchNo: payload.batchNo,
        date: new Date(payload.date),
        voucherType: VoucherType.PRODUCTION,
      },
    });

    const productInventory = {
      productId: payload.productinfo.productId,
      transectionId: transactionInfo.id,
      date: new Date(payload.date) || "",
      department: Department.PRODUCTION,
      quantityAdd: payload.productinfo.quantity || 0,
      unitPrice: payload.productinfo.unitPrice || 0,
      debitAmount:
        (payload.productinfo.quantity || 0) *
        (payload.productinfo.unitPrice || 0),
    };

    await tx.inventory.upsert({
      where: { id, productId: payload.productinfo.productId },
      update: productInventory,
      create: productInventory,
    });

    if (payload?.rawMaterials) {
      const rawMaterialInventory = await Promise.all(
        payload.rawMaterials.map(
          async (item: {
            rawId: number;
            quantity: number;
            unitPrice: number;
          }) => {
            const rawMaterial = await tx.rawMaterial.findFirst({
              where: {
                id: item.rawId,
                status: Status.ACTIVE,
              },
            });

            if (!rawMaterial) {
              throw new Error("Raw Material not found");
            }

            await tx.inventory.upsert({
              where: {
                id,
                rawId: rawMaterial.id,
              },
              update: {
                rawId: rawMaterial.id,
                transactionId: transactionInfo.id,
                date: new Date(payload.date),
                department: Department.PRODUCTION,
                quantityLess: item.quantity,
                unitPrice: item.unitPrice,
                creditAmount: item.quantity * item.unitPrice,
              },
              create: {
                rawId: rawMaterial.id,
                transactionId: transactionInfo.id,
                date: new Date(payload.date),
                department: Department.PRODUCTION,
                quantityLess: item.quantity | 0,
                unitPrice: item.unitPrice | 0,
                creditAmount: (item.quantity * item.unitPrice) | 0,
              },
            });
          },
        ),
      );
    }

    if (payload?.productionExpenses) {
      await Promise.all(
        payload.productionExpenses.map(
          async (Item: {
            proExpencesItemId: number;
            unitRate: number;
            expDuration: number;
            amount: number;
          }) => {
            const expencesItem = await tx.productionExpenseItem.findFirst({
              where: {
                id: Item.proExpencesItemId,
              },
            });
            if (!expencesItem) {
              throw new Error("Product Expencess Item not found");
            }

            await tx.productionExpensesInventory.upsert({
              where: {
                id,
                proExpencesItemId: Item.proExpencesItemId,
              },
              update: {
                date: new Date(payload.date),
                proExpencesItemId: expencesItem.id,
                transectionId: transactionInfo.id,
                unitRate: Item.unitRate,
                expDuration: Item.expDuration,
                amount: Item.unitRate * Item.expDuration,
              },
              create: {
                date: new Date(payload.date),
                proExpencesItemId: expencesItem.id,
                transectionId: transactionInfo.id,
                unitRate: Item.unitRate,
                expDuration: Item.expDuration,
                amount: Item.unitRate * Item.expDuration,
              },
            });
          },
        ),
      );
    }

    if (payload?.packingMaterials) {
      await Promise.all(
        payload.packingMaterials.map(
          async (packmaterial: {
            packingMaterialId: number;
            unitPrice: number;
            Qty: number;
            perUnitQty: number;
            perUnitCost: number;
          }) => {
            const packmaterials = await tx.packingMaterial.findFirst({
              where: {
                id: packmaterial.packingMaterialId,
              },
            });

            if (!packmaterials) {
              throw new Error("Packing Material Item not found");
            }

            await tx.pMInventory.upsert({
              where: {
                id,
                packingMaterialId: packmaterial.packingMaterialId,
              },
              update: {
                date: new Date(payload.date),
                packingMaterialId: packmaterials.id,
                transactionId: transactionInfo.id,
                department: Department.PRODUCTION,
                perUnitQty: packmaterial.perUnitQty,
                perUnitCost: packmaterial.perUnitCost,
                unitPrice: packmaterial.unitPrice,
                quantityLess: packmaterial.Qty,
              },
              create: {
                date: new Date(payload.date),
                packingMaterialId: packmaterial.packingMaterialId,
                transactionId: transactionInfo.id,
                department: Department.PRODUCTION,
                perUnitQty: packmaterial.perUnitQty,
                perUnitCost: packmaterial.perUnitCost,
                unitPrice: packmaterial.unitPrice,
                quantityLess: packmaterial.Qty,
              },
            });
          },
        ),
      );
    }
    return transactionInfo;
  });

  const getCreatedProduction = await prisma.transactionInfo.findUnique({
    where: {
      id: addProduction.id,
    },
  });

  return getCreatedProduction;
};

const getProduction = async () => {
  const result = await prisma.transactionInfo.findMany({
    where: {
      voucherType: VoucherType.PRODUCTION,
    },
    include: {
      inventory: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          raWMaterial: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      pminventories: {
        include: {
          packingMaterial: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      productionExpensesInventory: {
        include: {
          productionExpenseItem: {
            select: {
              id: true,
              expItemName: true,
            },
          },
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
  const result = await prisma.transactionInfo.findUnique({
    where: {
      id: id,
    },
    include: {
      inventory: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          raWMaterial: {
            select: {
              id: true,
              name: true,
            },
          },
        },

      },
      pminventories: {
        include: {
          packingMaterial: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      productionExpensesInventory: {
        include: {
          productionExpenseItem: {
            select: {
              id: true,
              expItemName: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  return result;
};

const deleteProduction = async (id: number) => {
  const isExist = await prisma.transactionInfo.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Production not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventory.deleteMany({
      where: { id: isExist.id },
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
  deleteProduction,
};
