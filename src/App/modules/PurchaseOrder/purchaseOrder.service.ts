import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PurchaseOrderSearchAbleFields } from "./purchaseOrder.constant";
import AppError from "../../errors/AppError";
import { Prisma, PurchaseOrderInfo, Status } from "@prisma/client";

const createPurchaseOrder = async (payload: PurchaseOrderInfo) => {
  const isExist = await prisma.purchaseOrderInfo.findFirst({
    where: {
      orderNo: payload.orderNo,
      status: { not: Status.DELETED },
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Order Number Already Exist");
  }

  const result = await prisma.purchaseOrderInfo.create({
    data: {
      orderNo: payload.orderNo,
      date: payload.date,
      partyId: payload.partyId,
      status: payload.status,
      purchaseOrder: {
        create: (payload as any).purchaseOrder || [],
      },
    },
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

  return result;
};

const getAllPurchaseOrders = async (
  params: any,
  paginat: IPaginationOptions
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

  const filterConditions = Object.keys(filterData).map((key) => {
    if (key === "status" || key === "partyId") {
      return undefined;
    }
    return {
      [key]: {
        equals: filterData[key],
      },
    };
  }).filter((condition) => condition !== undefined);

  if (filterConditions.length > 0) {
    andCondition.push({
      AND: filterConditions as Prisma.PurchaseOrderInfoWhereInput[],
    });
  }

  andCondition.push({
    status: { not: Status.DELETED },
  });

  const whereConditions: Prisma.PurchaseOrderInfoWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : { status: { not: Status.DELETED } };

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
      party: true,
      purchaseOrder: {
        include: {
          product: true,
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
      party: true,
      purchaseOrder: {
        include: {
          product: true,
          raWMaterial: true,
        },
      },
    },
  });

  return result;
};

const updatePurchaseOrderById = async (
  id: number,
  payload: Partial<PurchaseOrderInfo>
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