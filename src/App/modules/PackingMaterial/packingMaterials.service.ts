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

  const isUnitExist = await prisma.unit.findUnique({
    where: { id: Number(payload.unitId) },
  });

  if (!isUnitExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Unit with ID ${payload.unitId} does not exist.`
    );
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
      alertQuantity: Number(payload.alertQuantity) || 0,
      openingDate,
      openingAmount: Number(payload.amount) || 0,
      inventory: {
        create: {
          date: openingDate,
          department: Department.MP_STORE,
          unitPrice: Number(payload.unitPrice) || 0,
          quantityAdd: Number(payload.quantity) || 0,
          debitAmount: Number(payload.amount) || 0,
          isOpening: true,
        },
      },
    },
    include: {
      unit: true,
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

  const unitIds = [
    ...new Set(payloads.map((item) => Number(item.unitId)).filter(Boolean)),
  ];

  const existingUnits = await prisma.unit.findMany({
    where: {
      id: { in: unitIds },
    },
    select: {
      id: true,
    },
  });

  const existingUnitIdSet = new Set(existingUnits.map((u) => u.id));
  const missingUnits = unitIds.filter((id) => !existingUnitIdSet.has(id));

  if (missingUnits.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Unit ID(s) not found in database: ${missingUnits.join(", ")}. Please create unit(s) first.`
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
          alertQuantity: Number(payload.alertQuantity) || 0,
          openingDate,
          openingAmount: Number(payload.amount) || 0,
          inventory: {
            create: {
              date: openingDate,
              department: Department.MP_STORE,
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
      alertQuantity: payload.alertQuantity !== undefined ? Number(payload.alertQuantity) : undefined,
      openingAmount:
        payload.openingAmount !== undefined
          ? Number(payload.openingAmount)
          : payload.amount !== undefined
            ? Number(payload.amount)
            : undefined,
    },
    include: {
      unit: true,
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
