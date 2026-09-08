"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createUnit = async (payload) => {
    const isExist = await prisma_1.default.unit.findFirst({
        where: {
            name: payload.name,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This name already use");
    }
    const result = await prisma_1.default.unit.create({
        data: payload,
    });
    return result;
};
const getAllUnit = async () => {
    const result = await prisma_1.default.unit.findMany();
    return result;
};
const getUnitById = async (id) => {
    const result = await prisma_1.default.unit.findFirst({
        where: {
            id: id,
        },
    });
    return result;
};
const updateUnit = async (id, payload) => {
    const result = await prisma_1.default.unit.update({
        where: {
            id: id,
        },
        data: {
            name: payload.name,
        },
    });
    return result;
};
// delete unit
const deleteUnit = async (id) => {
    const existUnit = await prisma_1.default.unit.findUnique({
        where: {
            id: id
        }
    });
    if (!existUnit) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Unit not found");
    }
    const [productCount, rawMaterialCount] = await prisma_1.default.$transaction([
        prisma_1.default.product.count({ where: { unitId: id } }),
        prisma_1.default.rawMaterial.count({ where: { unitId: id } }),
    ]);
    if (productCount > 0 || rawMaterialCount > 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Cannot delete this unit because it is used by ${productCount} product(s) and ${rawMaterialCount} raw material(s)`);
    }
    const result = await prisma_1.default.unit.delete({
        where: {
            id: id
        }
    });
    return result;
};
exports.UnitService = {
    createUnit,
    getAllUnit,
    getUnitById,
    updateUnit,
    deleteUnit
};
