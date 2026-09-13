import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createPackage = async (payload: any) => {
  const isProductExisted = await prisma.product.findFirst({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  if (!isProductExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product not found");
  }

  if (isProductExisted.quantity < payload.totalPcs) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient stock");
  }

  const result = await prisma.$transaction(async (tx) => {
    const packageCreated = await tx.package.create({
      data: {
        batchNo: payload.batchNo,
        date: new Date(payload.date),
        pcsPerPack: payload.pcsPerPack,
        totalPacks: payload.totalPacks,
        totalPcs: payload.totalPcs,
        type: payload.type,
        voucherNo: payload.voucherNo,
        productId: payload.productId,
      },
    });

    await tx.product.update({
      where: { id: payload.productId },
      data: {
        quantity: {
          decrement: payload.totalPcs,
        },
      },
    });

    return packageCreated;
  });

  return result;
};

const getAllPackages = async () => {
  const result = await prisma.package.findMany({

    orderBy: {
      date: "desc",
    },
  });

  return result;
};

const getPackageById = async (id: number) => {
  const result = await prisma.package.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Package not found");
  }

  return result;
};

const updatePackage = async (id: number, payload: any) => {
  const isExist = await prisma.package.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Package not found");
  }

  const result = await prisma.package.update({
    where: {
      id: id,
    },
    data: {
      batchNo: payload.batchNo,
      date: payload.date ? new Date(payload.date) : undefined,
      pcsPerPack: payload.pcsPerPack,
      totalPacks: payload.totalPacks,
      totalPcs: payload.totalPcs,
      type: payload.type,
      voucherNo: payload.voucherNo,
      productId: payload.productId,
    },
  });

  return result;
};

const deletePackage = async (id: number) => {
  const isExist = await prisma.package.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Package not found");
  }

  await prisma.package.delete({
    where: { id: id },
  });

  return isExist;
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
