import prisma from "../../../shared/prisma";
import { AccountHead } from "@prisma/client";


const createPliersItemIntoDB = async (
  payLoad: AccountHead[]
) => {
  const result = await prisma.accountHead.createMany({
    data: payLoad,
  });

  return result; // { count: number }
};


const getAllPillerItem = async () => {
  const result: AccountHead[] = await prisma.accountHead.findMany();

  return result;
};

export const PillersService = {
  createPliersItemIntoDB,
  getAllPillerItem,
};
