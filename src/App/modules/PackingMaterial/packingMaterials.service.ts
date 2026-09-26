import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TpackingMaterial } from "./packingMaterials.types";
import { Department, PackingMaterial } from "@prisma/client";

const createPackingMaterial = async (payload: TpackingMaterial) => {
  const isExist = await prisma.packingMaterial.findFirst({
    where: {
      name: payload?.name,
      isDeleted: false,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name is already used");
  }

  const openingDate =
    payload.date && !isNaN(new Date(payload.date).getTime())
      ? new Date(payload.date)
      : new Date();

  const packingMaterial = await prisma.packingMaterial.create({
    data: {
      name: payload.name,
      description: payload.description,
      unitId: Number(payload.unitId),
      unitPrice: Number(payload.unitPrice) || 0,
      quantity: Number(payload.quantity) || 0,
      ingredienteQty: Number(payload.ingredienteQty) || 0,
      productIngradientId: payload.productIngradientId ? Number(payload.productIngradientId) : null,
      openingDate,
      openingAmount: Number(payload.amount) || 0,
      inventory: {
        create: {
          date: openingDate,
          Department: Department.MP_STORE,
          unitPrice: Number(payload.unitPrice) || 0,
          quantityAdd: Number(payload.quantity) || 0,
          debitAmount: Number(payload.amount) || 0,
          isOpening: true,
        },
      },
    },
    include: {
      unit: true,
      productIngradient: true,
    },
  });

  return packingMaterial;
};

const createPackingMaterialsMany = async (payloads: TpackingMaterial[]) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "At least one packing material is required"
    );
  }
  const names = payloads.map((item) => item?.name?.trim()).filter(Boolean);

  const existing = await prisma.packingMaterial.findMany({
    where: {
      name: {
        in: names,
      },
      isDeleted: false,
    },
    select: {
      name: true,
    },
  });

  if (existing.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `These names are already used: ${existing
        .map((item) => item.name)
        .join(", ")}`
    );
  }

  const result = await prisma.$transaction(
    payloads.map((payload) => {
      const openingDate =
        payload.date && !isNaN(new Date(payload.date).getTime())
          ? new Date(payload.date)
          : new Date();

      return prisma.packingMaterial.create({
        data: {
          name: payload.name,
          description: payload.description ?? null,
          unitId: Number(payload.unitId),
          unitPrice: Number(payload.unitPrice) || 0,
          quantity: Number(payload.quantity) || 0,
          ingredienteQty: Number(payload.ingredienteQty) || 0,
          productIngradientId: payload.productIngradientId ? Number(payload.productIngradientId) : null,
          openingDate,
          openingAmount: Number(payload.amount) || 0,
          inventory: {
            create: {
              date: openingDate,
              Department: Department.MP_STORE,
              unitPrice: Number(payload.unitPrice) || 0,
              quantityAdd: Number(payload.quantity) || 0,
              debitAmount: Number(payload.amount) || 0,
              isOpening: true,
            },
          },
        },
      });
    })
  );

  return result;
};

const getAllPackingMaterial = async (filters?: { search?: string }) => {
  const where: any = {
    isDeleted: false,
  };

  if (filters?.search) {
    where.name = {
      contains: filters.search,
    };
  }

  const result = await prisma.packingMaterial.findMany({
    where,
    include: {
      unit: true,
      productIngradient: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getPackingMaterialById = async (id: number) => {
  const result = await prisma.packingMaterial.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      unit: true,
      productIngradient: true,
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Packing material not found");
  }

  return result;
};

const updatePackingMaterial = async (
  id: number,
  payload: Partial<PackingMaterial> & { amount?: number }
) => {
  const isExist = await prisma.packingMaterial.findFirst({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Packing material not found");
  }

  const result = await prisma.packingMaterial.update({
    where: {
      id,
    },
    data: {
      name: payload.name,
      unitId: payload.unitId ? Number(payload.unitId) : undefined,
      description: payload.description,
      unitPrice: payload.unitPrice !== undefined ? Number(payload.unitPrice) : undefined,
      quantity: payload.quantity !== undefined ? Number(payload.quantity) : undefined,
      ingredienteQty: payload.ingredienteQty !== undefined ? Number(payload.ingredienteQty) : undefined,
      productIngradientId: payload.productIngradientId !== undefined ? payload.productIngradientId : undefined,
      openingAmount:
        payload.openingAmount !== undefined
          ? Number(payload.openingAmount)
          : payload.amount !== undefined
          ? Number(payload.amount)
          : undefined,
    },
    include: {
      unit: true,
      productIngradient: true,
    },
  });

  return result;
};

const deletePackingMaterial = async (id: number) => {
  const isExist = await prisma.packingMaterial.findFirst({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Packing material not found");
  }
  const result = await prisma.packingMaterial.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const PackingMaterialsService = {
  createPackingMaterial,
  createPackingMaterialsMany,
  getAllPackingMaterial,
  getPackingMaterialById,
  updatePackingMaterial,
  deletePackingMaterial,
};
