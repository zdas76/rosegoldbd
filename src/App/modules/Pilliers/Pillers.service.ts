import prisma from "../../../shared/prisma";
import { AccountHead } from "@prisma/client";

const createPliersItemIntoDB = async (payLoad: AccountHead[]) => {
  console.log(payLoad);
  const result = await prisma.accountHead.createMany({
    data: payLoad,
  });

  return result;
};

const getAllPillerItem = async () => {
  const result: AccountHead[] = await prisma.accountHead.findMany({});

  return result;
};

export const PillersService = {
  createPliersItemIntoDB,
  getAllPillerItem,
};
