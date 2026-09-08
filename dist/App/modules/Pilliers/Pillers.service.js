"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PillersService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createPliersItemIntoDB = async (payLoad) => {
    console.log(payLoad);
    const result = await prisma_1.default.accountHead.createMany({
        data: payLoad,
    });
    return result;
};
const getAllPillerItem = async () => {
    const result = await prisma_1.default.accountHead.findMany({});
    return result;
};
exports.PillersService = {
    createPliersItemIntoDB,
    getAllPillerItem,
};
