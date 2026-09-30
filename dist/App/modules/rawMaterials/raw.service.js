"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowMaterialsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const createRawMaterial = async (payload) => {
    const isExist = await prisma_1.default.rawMaterial.findFirst({
        where: {
            name: payload?.name,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This name is already used");
    }
    const isUnitExist = await prisma_1.default.unit.findUnique({
        where: { id: Number(payload.unitId) },
    });
    if (!isUnitExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Unit with ID ${payload.unitId} does not exist. Please create the unit first.`);
    }
    const openingDate = payload.date && !isNaN(new Date(payload.date).getTime())
        ? new Date(payload.date)
        : new Date();
    const rawMeterial = await prisma_1.default.rawMaterial.create({
        data: {
            name: payload.name,
            description: payload.description,
            unitId: Number(payload.unitId),
            unitPrice: payload.unitPrice,
            quantity: payload.quantity,
            ingredienteQty: payload.ingredienteQty ?? 0,
            openingDate,
            openingAmount: payload.amount,
            inventory: {
                create: {
                    date: openingDate,
                    department: client_1.Department.RM_STORE,
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
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "At least one raw material is required");
    }
    const names = payloads.map((item) => item?.name?.trim());
    const existing = await prisma_1.default.rawMaterial.findMany({
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
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `These names are already used: ${existing
            .map((item) => item.name)
            .join(", ")}`);
    }
    const unitIds = [
        ...new Set(payloads.map((item) => Number(item.unitId)).filter(Boolean)),
    ];
    const existingUnits = await prisma_1.default.unit.findMany({
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
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Unit ID(s) not found in database: ${missingUnits.join(", ")}. Please create unit(s) first.`);
    }
    const result = await prisma_1.default.$transaction(payloads.map((payload) => {
        const openingDate = payload.date && !isNaN(new Date(payload.date).getTime())
            ? new Date(payload.date)
            : new Date();
        return prisma_1.default.rawMaterial.create({
            data: {
                name: payload.name,
                description: payload.description ?? null,
                unitId: Number(payload.unitId),
                unitPrice: payload.unitPrice ?? 0,
                quantity: payload.quantity ?? 0,
                ingredienteQty: payload.ingredienteQty ?? 0,
                openingDate,
                openingAmount: payload.amount ?? 0,
                inventory: {
                    create: {
                        date: openingDate,
                        department: client_1.Department.RM_STORE,
                        unitPrice: payload.unitPrice ?? 0,
                        quantityAdd: payload.quantity ?? 0,
                        debitAmount: payload.amount ?? 0,
                        isOpening: true,
                    },
                },
            },
        });
    }));
    return result;
};
const getAllRawMaterial = async () => {
    const result = await prisma_1.default.rawMaterial.findMany({
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
    const result = await prisma_1.default.rawMaterial.findFirst({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
};
const updateRawMaterial = async (id, payload) => {
    const isExist = await prisma_1.default.rawMaterial.findFirst({
        where: { id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No material found");
    }
    const result = await prisma_1.default.rawMaterial.update({
        where: {
            id,
        },
        data: {
            name: payload.name,
            unitId: payload.unitId,
            description: payload.description,
            unitPrice: payload.unitPrice,
            quantity: payload.quantity,
            ingredienteQty: payload.ingredienteQty,
            openingAmount: payload.openingAmount,
        },
    });
    return result;
};
const deleteRawMaterial = async (id) => {
    const isExist = await prisma_1.default.rawMaterial.findFirst({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No material found");
    }
    const result = await prisma_1.default.rawMaterial.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
};
exports.RowMaterialsService = {
    createRawMaterial,
    createRawMaterialsMany,
    getAllRawMaterial,
    getRawMaterialById,
    updateRawMaterial,
    deleteRawMaterial,
};
