import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { Status } from "@prisma/client";
const creatUserToDB = async (payload) => {
    const hashedPassword = bcrypt.hashSync(payload.password, parseInt(config.hash_round));
    const createUser = await prisma.user.create({
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
    const result = await prisma.user.findMany({
        where: {
            status: Status.ACTIVE,
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
    const result = await prisma.user.findFirst({
        where: {
            id: id,
            status: Status.ACTIVE,
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
    const result = await prisma.user.update({
        where: {
            id: id,
            status: Status.ACTIVE,
        },
        data: payload,
    });
    return result;
};
const deleteUserById = async (id) => {
    const result = await prisma.user.update({
        where: {
            id: id,
            status: Status.ACTIVE,
        },
        data: {
            status: Status.DELETED,
        },
    });
    return result;
};
export const UserService = {
    creatUserToDB,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById,
};
