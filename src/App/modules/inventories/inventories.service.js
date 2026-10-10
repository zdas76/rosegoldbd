 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";


const getInventory = async () => {
  return await prisma.inventory.findMany({
    orderBy: [{ productId: "asc" }, { rawId: "asc" }],
  });
};
const getInventoryById = async (id) => {
  return await prisma.inventory.findFirst({
    where: {
      id,
    },
    include: {
      product: true,
      raWMaterial: true,
    },
  });
};

const getInventoryAggValueById = async (query) => {
  if (query.itemType === "product") {
    const getDate = await prisma.inventory.findFirst({
      where: {
        productId: Number(query.productId),
        isOpening: true,
      },
      orderBy: [{ id: "desc" }],
    });

    if (!_optionalChain([getDate, 'optionalAccess', _ => _.date])) {
      throw new AppError(StatusCodes.NOT_FOUND, "date not found");
    }

    const result = await prisma.$queryRaw`
  SELECT 
    i.productId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(i.debitAmount, 0)- IFNULL(i.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  WHERE i.productId = ${query.productId} AND i.date>=${_optionalChain([getDate, 'optionalAccess', _2 => _2.date])}
  GROUP BY i.productId`;

    return result;
  }

  if (query.itemType === "raw") {
    const getDate = await prisma.inventory.findFirst({
      where: {
        rawId: Number(query.rawId),
        isOpening: true,
      },

      orderBy: [{ id: "desc" }],
    });

    const result = await prisma.$queryRaw`
  SELECT 
    i.rawId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(i.debitAmount, 0) - IFNULL(i.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  WHERE i.rawId = ${query.rawId} AND i.date>=${_optionalChain([getDate, 'optionalAccess', _3 => _3.date])}
  GROUP BY i.rawId`;

    return result;
  }
};

const updateInventory = async (id, payload) => {
  return await prisma.inventory.updateMany({
    where: {},
    data: {},
  });
};

// const deleteInventory = async (id: number, payload: Inventory) => {
//   return console.log("first");
// };

//get last rate of raw material
const getLastRawMaterialRate = async (ids) => {
  const result = await Promise.all(
    ids.map(async (id) => {
      return await prisma.inventory.findFirst({
        where: {
          rawId: id,
        },
        orderBy: [{ id: "desc" }],
        select: {
          rawId: true,
          unitPrice: true,
        }
      });
    })
  );
  return result;
}

export const InventoryService = {
  getInventory,
  getInventoryById,
  getInventoryAggValueById,
  updateInventory,
  // deleteInventory,
  getLastRawMaterialRate
};
