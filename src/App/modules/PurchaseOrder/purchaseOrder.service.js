 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { paginationHelper } from "../../../helpars/paginationHelpers";

import { PurchaseOrderSearchAbleFields } from "./purchaseOrder.constant";
import AppError from "../../errors/AppError";
import { Status } from "../../../generated/prisma";
import { GenerateVoucherNumber } from "../../../helpars/generateVoucherNumber";






const createPurchaseOrder = async (payload) => {
  const orderNo = await GenerateVoucherNumber("ReqO");
  const isExist = await prisma.purchaseOrderInfo.findFirst({
    where: {
      orderNo: orderNo,
    },
  });

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This Requisition Number Already Exist",
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

    if (_optionalChain([payload, 'access', _ => _.inventory, 'optionalAccess', _2 => _2.length])) {
      await Promise.all(
        payload.inventory.map(
          async (item) =>
            await tx.purchaseOrderInventory.create({
              data: {
                purchaseOrderId: orderInfo.id,
                productId: item.productId || null,
                rawId: item.rawId || null,
                quantity: item.quantity,
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
          quantity: true,
        },
      },
    },
  });

  return resutl;
};

const getAllPurchaseOrders = async (
  params,
  paginat,
) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: PurchaseOrderSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
        },
      })),
    });
  }

  if (_optionalChain([params, 'optionalAccess', _3 => _3.status])) {
    andCondition.push({
      status: params.status,
    });
  }

  if (_optionalChain([params, 'optionalAccess', _4 => _4.partyId])) {
    andCondition.push({
      partyId: Number(params.partyId),
    });
  }

  if (_optionalChain([params, 'optionalAccess', _5 => _5.type])) {
    if (params.type === "RAW_MATERIAL") {
      andCondition.push({
        purchaseOrder: {
          some: {
            rawId: { not: null },
          },
        },
      });
    } else if (params.type === "PRODUCT") {
      andCondition.push({
        purchaseOrder: {
          some: {
            productId: { not: null },
          },
        },
      });
    }
  }

  const filterConditions = Object.keys(filterData)
    .map((key) => {
      if (key === "status" || key === "partyId" || key === "type" || key === "searchTerm") {
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
      AND: filterConditions ,
    });
  }

  andCondition.push({
    status: { not: Status.DELETED },
  });

  const whereConditions =
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

const getPurchaseOrderById = async (id) => {
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

const getPurchaseOrderByOrderNo = async (orderNo) => {
  const result = await prisma.purchaseOrderInfo.findFirst({
    where: {
      orderNo,
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
              quantity: true,
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
  id,
  payload,
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


  const { purchaseOrder, ...orderData } = payload ;

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
        data: purchaseOrder.map((item) => ({
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

const deletePurchaseOrderById = async (id) => {
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
  getPurchaseOrderByOrderNo,
};
