
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TrawMaterial } from "./raw.types";
import { RawMaterial } from "@prisma/client";

const createRawMaterial = async (payload: TrawMaterial) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: {
      name: payload?.name,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name is already used");
  }

  const openingDate =
    payload.date && !isNaN(new Date(payload.date).getTime())
      ? new Date(payload.date)
      : new Date();

  const rawMeterial = await prisma.rawMaterial.create({
    data: {
      name: payload.name,
      description: payload.description,
      unitId: payload.unitId,
      unitPrice: payload.unitPrice,
      quantity: payload.quantity,
      openingDate,
      openingAmount: payload.amount,
      inventory: {
        create: {
          date: openingDate,
          unitPrice: payload.unitPrice,
          quantityAdd: payload.quantity,
          debitAmount: payload.amount,
          isOpening: true,
        },
      },
    },
  });

  return rawMeterial;
};

const createRawMaterialsMany = async (payloads: TrawMaterial[]) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "At least one raw material is required"
    );
  }
  const names = payloads.map((item) => item?.name?.trim());

  const existing = await prisma.rawMaterial.findMany({
    where: {
      name: {
        in: names,
      },
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

      return prisma.rawMaterial.create({
        data: {
          name: payload.name,
          description: payload.description ?? null,
          unitId: payload.unitId,
          unitPrice: payload.unitPrice ?? 0,
          quantity: payload.quantity ?? 0,
          openingDate,
          openingAmount: payload.amount ?? 0,
          inventory: {
            create: {
              date: openingDate,
              unitPrice: payload.unitPrice ?? 0,
              quantityAdd: payload.quantity ?? 0,
              debitAmount: payload.amount ?? 0,
              isOpening: true,
            },
          },
        },
      });
    })
  );

  return result;
};

const getAllRawMaterial = async () => {
  const result = await prisma.rawMaterial.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      unit: true,
    },
  });
  return result;
};

const getRawMaterialById = async (id: number) => {
  const result = await prisma.rawMaterial.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateRawMaterial = async (id: number, payload: Partial<RawMaterial>) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No material found");
  }

  const result = await prisma.rawMaterial.update({
    where: {
      id,
    },
    data: {
      name: payload.name,
      unitId: payload.unitId,
      description: payload.description,
      unitPrice: payload.unitPrice,
      quantity: payload.quantity,
      openingAmount: payload.openingAmount,
    },
  });

  return result;
};

const deleteRawMaterial = async (id: number) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No material found");
  }
  const result = await prisma.rawMaterial.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};



export const RowMaterialsService = {
  createRawMaterial,
  createRawMaterialsMany,
  getAllRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,

};
