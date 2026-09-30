import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

interface MaterialInput {
  id: number;
  ingredienteQty?: number;
}

const extractMaterials = (items: any): MaterialInput[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  const result: MaterialInput[] = [];
  for (const item of items) {
    if (typeof item === "number") {
      result.push({ id: item });
    } else if (item && typeof item === "object") {
      const id = item.id ?? item.rawId ?? item.packingId;
      if (typeof id === "number") {
        result.push({
          id,
          ingredienteQty:
            typeof item.ingredienteQty === "number"
              ? item.ingredienteQty
              : typeof item.quantity === "number"
                ? item.quantity
                : undefined,
        });
      }
    }
  }

  return result;
};

const ingredientInclude = {
  ingredientRawMaterials: {
    select: {
      id: true,
      rawId: true,
      rawMaterials: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  ingredientPackingMaterial: {
    select: {
      id: true,
      packingMaterialId: true,
      packingMaterial: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  ingredientExpneseItems: {
    select: {
      id: true,
      productionExpenssItemId: true,
      productionExpenseItem: {
        select: {
          id: true,
          expItemName: true,
        },
      },
    },
  },
};

const createProductIngradient = async (payload: {
  productId: number;
  packingMaterials: [];
  rawMaterials: [];
  ingredientExpneseItems: [];
}) => {
  const { productId, packingMaterials, rawMaterials, ingredientExpneseItems } =
    payload;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const created = await tx.productionIngradient.create({
      data: {
        productId,
        ingredientRawMaterials: {
          createMany: {
            data: rawMaterials.map((item) => ({
              rawId: Number(item),
            })),
          },
        },
        ingredientPackingMaterial: {
          createMany: {
            data: packingMaterials.map((item) => ({
              packingMaterialId: Number(item),
            })),
          },
        },
        ingredientExpneseItems: {
          createMany: {
            data: ingredientExpneseItems.map((item) => ({
              productionExpenssItemId: Number(item),
            })),
          },
        },
      },

      include: {
        ingredientRawMaterials: true,
        ingredientPackingMaterial: true,
        ingredientExpneseItems: true,
      },
    });

    const finalResult = await tx.productionIngradient.findUnique({
      where: { id: created.id },
      include: ingredientInclude,
    });
    return {
      ...finalResult,
      product,
    };
  });

  return result;
};

const getAllProductIngradients = async (filters?: { productId?: number }) => {
  const where: any = {};
  if (filters?.productId) {
    where.productId = Number(filters.productId);
  }

  const result = await prisma.productionIngradient.findMany({
    where,
    include: ingredientInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  const productIds = Array.from(new Set(result.map((item) => item.productId)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      unit: true,
      subCategory: true,
    },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  return result.map((item) => ({
    ...item,
    product: productMap.get(item.productId) || null,
  }));
};

const getProductIngradientById = async (id: number) => {
  const result = await prisma.productionIngradient.findUnique({
    where: { id },
    include: ingredientInclude,
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product ingradient not found");
  }

  const product = await prisma.product.findUnique({
    where: { id: result.productId },
    include: {
      unit: true,
      subCategory: true,
    },
  });

  return {
    ...result,
    product: product || null,
  };
};

const getProductionIngradientByProductId = async (productId: number) => {
  const result = await prisma.productionIngradient.findFirst({
    where: { productId },
    include: ingredientInclude,
  });

  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Product ingradient not found for this product",
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      unit: true,
      subCategory: true,
    },
  });

  return {
    ...result,
    product: product || null,
  };
};

// const updateProductionIngradientById = async (id: number, payload: any) => {
//   const isExist = await prisma.productionIngradient.findUnique({
//     where: { id },
//   });

//   if (!isExist) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Product ingradient not found");
//   }

//   let productId = isExist.productId;
//   if (payload.productId) {
//     productId = Number(payload.productId);
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });
//     if (!product) {
//       throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
//     }
//   }

//   const hasRaw =
//     payload.rawMaterials !== undefined || payload.rawMaterialIds !== undefined;
//   const rawMaterials = hasRaw
//     ? extractMaterials(payload.rawMaterials ?? payload.rawMaterialIds)
//     : undefined;

//   const hasPack =
//     payload.packingMaterials !== undefined ||
//     payload.packingMaterialIds !== undefined;
//   const packingMaterials = hasPack
//     ? extractMaterials(payload.packingMaterials ?? payload.packingMaterialIds)
//     : undefined;

// const result = await prisma.$transaction(async (tx) => {
//   if (rawMaterials !== undefined) {
//     await tx.rawMaterial.updateMany({
//       where: { production: id },
//       data: { productionIngradientId: null },
//     });

//     if (rawMaterials.length > 0) {
//       const rawIds = rawMaterials.map((item) => item.id);
//       await tx.rawMaterial.updateMany({
//         where: { id: { in: rawIds } },
//         data: { productIngradientId: id },
//       });

//       for (const raw of rawMaterials) {
//         if (raw.ingredienteQty !== undefined) {
//           await tx.rawMaterial.update({
//             where: { id: raw.id },
//             data: { ingredienteQty: raw.ingredienteQty },
//           });
//         }
//       }
//     }
//   }

//   if (packingMaterials !== undefined) {
//     await tx.packingMaterial.updateMany({
//       where: { productIngradientId: id },
//       data: { productIngradientId: null },
//     });

//     if (packingMaterials.length > 0) {
//       const packIds = packingMaterials.map((item) => item.id);
//       await tx.packingMaterial.updateMany({
//         where: { id: { in: packIds } },
//         data: { productIngradientId: id },
//       });

//       for (const pack of packingMaterials) {
//         if (pack.ingredienteQty !== undefined) {
//           await tx.packingMaterial.update({
//             where: { id: pack.id },
//             data: { ingredienteQty: pack.ingredienteQty },
//           });
//         }
//       }
//     }
//   }

//   const updated = await tx.productIngradient.update({
//     where: { id },
//     data: {
//       productId,
//     },
//     include: {
//       rawMaterials: {
//         include: {
//           unit: true,
//         },
//       },
//       packingMaterials: {
//         include: {
//           unit: true,
//         },
//       },
//     },
//   });

//   const finalResult = await tx.productIngradient.findUnique({
//     where: { id },
//     include: {
//       rawMaterials: {
//         include: {
//           unit: true,
//         },
//       },
//       packingMaterials: {
//         include: {
//           unit: true,
//         },
//       },
//     },
//   });
//   return {
//     ...finalResult,
//     product,
//   };
// });

// return result;
// };

export const ProductIngradientService = {
  createProductIngradient,
  getAllProductIngradients,
  getProductIngradientById,
};
