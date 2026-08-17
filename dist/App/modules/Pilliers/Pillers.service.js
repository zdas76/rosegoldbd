import prisma from "../../../shared/prisma";
const createPliersItemIntoDB = async (payLoad) => {
    const result = await prisma.accountMainPiller.createMany({
        data: payLoad,
    });
    return result; // { count: number }
};
const getAllPillerItem = async () => {
    const result = await prisma.accountMainPiller.findMany();
    return result;
};
export const PillersService = {
    createPliersItemIntoDB,
    getAllPillerItem,
};
