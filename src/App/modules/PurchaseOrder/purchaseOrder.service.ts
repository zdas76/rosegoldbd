import { Payload } from "./../../../generated/prisma/internal/prismaNamespace";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PurchaseOrderSearchAbleFields } from "./purchaseOrder.constant";
import AppError from "../../errors/AppError";
import { Prisma, Status } from "@prisma/client";
import { GenerateVoucherNumber } from "../../../helpars/generateVoucherNumber";
import {
  CreatePurchaseOrder,
  UpdatePurchaseOrder,
} from "./purchaseOrder.validation";

const createPurchaseOrder = async (payload: CreatePurchaseOrder) => {
  const orderNo = await GenerateVoucherNumber("PO");
  const isExist = await prisma.purchaseOrderInfo.findFirst({
    where: {
      orderNo: orderNo,
    },
  });

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This Order Number Already Exist",
    );
  }

  const PurchsedOrder = await prisma.$transaction(async (tx) => {
    const orderInfo = await tx.purchaseOrderInfo.create({
      data: {
        orderNo: orderNo,
        date: new Date(payload.date),
        partyId: payload.partyId,
      },
    });

    if (payload.inventory?.length) {
      await Promise.all(
        payload.inventory.map(
          async (item) =>
            await tx.purchaseOrderInventory.create({
              data: {
                purchaseOrderId: orderInfo.id,
                productId: item.productId || null,
                rawId: item.rawId || null,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                amount: item.quantity * item.unitPrice,
              },
            }),
        ),
      );
    }

    return orderInfo;
  });

  const resutl = await prisma.purchaseOrderInfo.findFirst({
    where: {
      id: PurchsedOrder.id,
    },
    select: {
      purchaseOrder: {
        select: {
          productId: true,
          rawId: true,
          unitPrice: true,
          quantity: true,
          amount: true,
          status: true,
        },
      },
    },
  });

  return resutl;
};

const getAllPurchaseOrders = async (
  params: any,
  paginat: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.PurchaseOrderInfoWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: PurchaseOrderSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
        },
      })),
    });
  }

  if (params?.status) {
    andCondition.push({
      status: params.status,
    });
  }

  if (params?.partyId) {
    andCondition.push({
      partyId: Number(params.partyId),
    });
  }

  const filterConditions = Object.keys(filterData)
    .map((key) => {
      if (key === "status" || key === "partyId") {
        return undefined;
      }
      return {
        [key]: {
          equals: filterData[key],
        },
      };
    })
    .filter((condition) => condition !== undefined);

  if (filterConditions.length > 0) {
    andCondition.push({
      AND: filterConditions as Prisma.PurchaseOrderInfoWhereInput[],
    });
  }

  andCondition.push({
    status: { not: Status.DELETED },
  });

  const whereConditions: Prisma.PurchaseOrderInfoWhereInput =
    andCondition.length > 0
      ? { AND: andCondition }
      : { status: { not: Status.DELETED } };

  const result = await prisma.purchaseOrderInfo.findMany({
    where: whereConditions,
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
    include: {
      party: {
        select: {
          id: true,
          name: true,
          contactNo: true,
          address: true,
        },
      },
      purchaseOrder: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          raWMaterial: true,
        },
      },
    },
  });

  return result;
};

const getPurchaseOrderById = async (id: number) => {
  const result = await prisma.purchaseOrderInfo.findFirst({
    where: {
      id,
      status: { not: Status.DELETED },
    },
    include: {
      party: {
        select: {
          id: true,
          name: true,
          contactNo: true,
          address: true,
        },
      },
      purchaseOrder: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          raWMaterial: true,
        },
      },
    },
  });

  return result;
};

const updatePurchaseOrderById = async (
  id: number,
  payload: Partial<UpdatePurchaseOrder>,
) => {
  const isExist = await prisma.purchaseOrderInfo.findFirst({
    where: {
      id,
      status: { not: Status.DELETED },
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Purchase Order Found");
  }

  const { purchaseOrder, ...orderData } = payload as any;

  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.purchaseOrderInfo.update({
      where: { id },
      data: orderData,
    });

    if (purchaseOrder) {
      await tx.purchaseOrderInventory.deleteMany({
        where: { purchaseOrderId: id },
      });

      await tx.purchaseOrderInventory.createMany({
        data: purchaseOrder.map((item: any) => ({
          purchaseOrderId: id,
          productId: item.productId,
          rawId: item.rawId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          amount: item.amount,
          status: item.status,
        })),
      });
    }

    return updatedOrder;
  });

  return prisma.purchaseOrderInfo.findFirst({
    where: { id },
    include: {
      party: true,
      purchaseOrder: {
        include: {
          product: true,
          raWMaterial: true,
        },
      },
    },
  });
};

const deletePurchaseOrderById = async (id: number) => {
  const isExist = await prisma.purchaseOrderInfo.findFirst({
    where: {
      id,
      status: { not: Status.DELETED },
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Purchase Order Found");
  }

  const result = await prisma.purchaseOrderInfo.update({
    where: { id },
    data: {
      status: Status.DELETED,
    },
  });

  return result;
};

export const PurchaseOrderService = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderById,
  deletePurchaseOrderById,
};
