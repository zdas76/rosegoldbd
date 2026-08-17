import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
const createAccountsItemtoDB = async (payLoad) => {
    const accountsItemId = Number(payLoad.accountMainPillerId) + payLoad.accountsItemId;
    const isExistItemId = await prisma.accountsItem.findFirst({
        where: {
            accountsItemId: accountsItemId,
        },
    });
    if (isExistItemId) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This item already exist");
    }
    const checkName = await prisma.accountsItem.findFirst({
        where: {
            accountsItemName: payLoad.accountsItemName,
        },
    });
    if (checkName) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Accounts item name already exist");
    }
    const result = await prisma.accountsItem.create({
        data: {
            accountsItemId: accountsItemId,
            accountsItemName: payLoad.accountsItemName,
            accountMainPillerId: payLoad.accountMainPillerId,
        },
    });
    return result;
};
const getAccountsItemFromDB = async (payLoad) => {
    let filerValue = {};
    if (payLoad) {
        const filer = JSON.parse(payLoad).map((id) => {
            return { accountMainPillerId: id };
        });
        filerValue = {
            OR: filer,
        };
    }
    const result = await prisma.accountsItem.findMany({
        where: filerValue,
        orderBy: {
            accountMainPillerId: "asc",
        },
        include: {
            accountsPiler: true,
        },
    });
    return result;
};
const getAccountsItemByIdFromDB = async (id) => {
    const result = await prisma.accountsItem.findFirst({
        where: { id },
        include: {
            accountsPiler: true,
        },
    });
    return result;
};
const updateAccountsItemFromDBbyId = async (id, payLoad) => {
    const isExistItemId = await prisma.accountsItem.findFirst({
        where: {
            id: id,
        },
    });
    if (!isExistItemId) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This item not found");
    }
    const accountsItemId = Number(payLoad.accountMainPillerId) + isExistItemId.accountsItemId.toString().slice(-4);
    const checkName = await prisma.accountsItem.findFirst({
        where: {
            accountsItemName: payLoad.accountsItemName,
            accountsItemId: isExistItemId.accountsItemId,
            NOT: {
                id: id,
            },
        },
    });
    if (checkName) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Accounts item name already exist");
    }
    const result = await prisma.accountsItem.update({
        where: { id },
        data: {
            accountsItemId: accountsItemId,
            accountsItemName: payLoad.accountsItemName,
            accountMainPillerId: payLoad.accountMainPillerId,
        },
    });
    return result;
};
export const AccountItemService = {
    createAccountsItemtoDB,
    getAccountsItemFromDB,
    getAccountsItemByIdFromDB,
    updateAccountsItemFromDBbyId,
};
