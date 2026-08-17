import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
const createRawMaterial = async (payload) => {
    const isExist = await prisma.rawMaterial.findFirst({
        where: {
            name: payload?.name,
        },
    });
    if (isExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This name is already used");
    }
    const rawMeterial = await prisma.rawMaterial.create({
        data: {
            name: payload.name,
            description: payload.description,
            unitId: payload.unitId,
            unitPrice: payload.unitPrice,
            quantity: payload.quantity,
            openingDate: new Date(payload.date),
            openingAmount: payload.amount,
            inventory: {
                create: {
                    date: new Date(payload.date),
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
    getAllRawMaterial,
    getRawMaterialById,
    updateRawMaterial,
    deleteRawMaterial,
};
