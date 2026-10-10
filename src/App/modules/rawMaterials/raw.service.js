 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

import { Department, } from "../../../generated/prisma";

const createRawMaterial = async (payload) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: {
      name: _optionalChain([payload, 'optionalAccess', _ => _.name]),
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
      `Unit with ID ${payload.unitId} does not exist. Please create the unit first.`,
    );
  }

  const openingDate =
    payload.date && !isNaN(new Date(payload.date).getTime())
      ? new Date(payload.date)
      : new Date();

  const rawMeterial = await prisma.rawMaterial.create({
    data: {
      name: payload.name,
      description: payload.description,
      unitId: Number(payload.unitId),
      unitPrice: payload.unitPrice,
      quantity: payload.quantity,
      openingDate,
      openingAmount: payload.amount,
      inventory: {
        create: {
          date: openingDate,
          department: Department.RM_STORE,
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

const createRawMaterialsMany = async (payloads) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "At least one raw material is required",
    );
  }
  const names = payloads.map((item) => _optionalChain([item, 'optionalAccess', _2 => _2.name, 'optionalAccess', _3 => _3.trim, 'call', _4 => _4()]));

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
        .join(", ")}`,
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
      `Unit ID(s) not found in database: ${missingUnits.join(", ")}. Please create unit(s) first.`,
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
          description: _nullishCoalesce(payload.description, () => ( null)),
          unitId: Number(payload.unitId),
          unitPrice: _nullishCoalesce(payload.unitPrice, () => ( 0)),
          quantity: _nullishCoalesce(payload.quantity, () => ( 0)),
          openingDate,
          openingAmount: _nullishCoalesce(payload.amount, () => ( 0)),
          inventory: {
            create: {
              date: openingDate,
              department: Department.RM_STORE,
              unitPrice: _nullishCoalesce(payload.unitPrice, () => ( 0)),
              quantityAdd: _nullishCoalesce(payload.quantity, () => ( 0)),
              debitAmount: _nullishCoalesce(payload.amount, () => ( 0)),
              isOpening: true,
            },
          },
        },
      });
    }),
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

const getRawMaterialById = async (id) => {
  const result = await prisma.rawMaterial.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateRawMaterial = async (id, payload) => {
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
      alertQuantity: payload.alertQuantity,
    },
  });

  return result;
};

const deleteRawMaterial = async (id) => {
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
