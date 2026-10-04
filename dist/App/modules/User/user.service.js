"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
const prisma_2 = require("../../../generated/prisma");
const creatUserToDB = async (payload) => {
    const hashedPassword = bcryptjs_1.default.hashSync(payload.password, parseInt(config_1.default.hash_round));
    const createUser = await prisma_1.default.user.create({
        data: {
            email: payload.email,
            password: hashedPassword,
            name: payload.name,
            phone: payload.phone,
        },
    });
    return createUser;
};
const getAllUser = async () => {
    const result = await prisma_1.default.user.findMany({
        where: {
            status: prisma_2.Status.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            status: true,
        },
    });
    return result;
};
const getUserById = async (id) => {
    const result = await prisma_1.default.user.findFirst({
        where: {
            id: id,
            status: prisma_2.Status.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            status: true,
        },
    });
    return result;
};
const updateUserById = async (id, payload) => {
    const result = await prisma_1.default.user.update({
        where: {
            id: id,
            status: prisma_2.Status.ACTIVE,
        },
        data: payload,
    });
    return result;
};
const deleteUserById = async (id) => {
    const result = await prisma_1.default.user.update({
        where: {
            id: id,
            status: prisma_2.Status.ACTIVE,
        },
        data: {
            status: prisma_2.Status.DELETED,
        },
    });
    return result;
};
exports.UserService = {
    creatUserToDB,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById,
};
