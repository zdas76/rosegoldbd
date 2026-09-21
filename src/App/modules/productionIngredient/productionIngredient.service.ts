import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { ProductionType } from "@prisma/client";

const extractRawIds = (payload: any): number[] | undefined => {
  if (Array.isArray(payload.rawMaterialIds)) {
    return payload.rawMaterialIds;
  }
  if (Array.isArray(payload.rawMaterials)) {
    return payload.rawMaterials
      .map((item: any) =>
        typeof item === "number" ? item : (item.id ?? item.rawId)
      )
      .filter((id: any): id is number => typeof id === "number");
  }
  return undefined;
};

const createProductionIngredient = async (payload: any) => {
  const rawIds = extractRawIds(payload);

  const result = await prisma.$transaction(async (tx) => {
    const created = await tx.productionIngradient.create({
      data: {
        productionName: payload.productionName,
        ...(payload.type ? { type: payload.type } : {}),
        ...(rawIds && rawIds.length > 0
          ? {
            rawMaterials: {
              connect: rawIds.map((id) => ({ id })),
            },
          }
          : {}),
      },
      include: {
        rawMaterials: {
          include: {
            unit: true,
          },
        },
      },
    });

    return created;
  });

  return result;
};

const getAllProductionIngredients = async (filters?: {
  type?: ProductionType;
}) => {
  const where: any = {};
  if (filters?.type) {
    where.type = filters.type;
  }

  const result = await prisma.productionIngradient.findMany({
    where,
    include: {
      rawMaterials: {
        include: {
          unit: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getProductionIngredientById = async (id: number) => {
  const result = await prisma.productionIngradient.findUnique({
    where: { id },
    include: {
      rawMaterials: {
        include: {
          unit: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Production ingredient not found");
  }

  return result;
};

const updateProductionIngredientById = async (id: number, payload: any) => {
  const isExist = await prisma.productionIngradient.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Production ingredient not found");
  }

  const rawIds = extractRawIds(payload);

  const result = await prisma.$transaction(async (tx) => {
    if (rawIds !== undefined) {
      await tx.rawMaterial.updateMany({
        where: { productionIngradientId: id },
        data: { productionIngradientId: null },
      });

      if (rawIds.length > 0) {
        await tx.rawMaterial.updateMany({
          where: { id: { in: rawIds } },
          data: { productionIngradientId: id },
        });
      }
    }

    const updated = await tx.productionIngradient.update({
      where: { id },
      data: {
        ...(payload.productionName
          ? { productionName: payload.productionName }
          : {}),
        ...(payload.type ? { type: payload.type } : {}),
      },
      include: {
        rawMaterials: {
          include: {
            unit: true,
          },
        },
      },
    });

    return updated;
  });

  return result;
};

const deleteProductionIngredientById = async (id: number) => {
  const isExist = await prisma.productionIngradient.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Production ingredient not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.rawMaterial.updateMany({
      where: { productionIngradientId: id },
      data: { productionIngradientId: null },
    });

    return await tx.productionIngradient.delete({
      where: { id },
    });
  });

  return result;
};

export const ProductionIngredientService = {
  createProductionIngredient,
  getAllProductionIngredients,
  getProductionIngredientById,
  updateProductionIngredientById,
  deleteProductionIngredientById,
};
