import prisma from "../../../shared/prisma";


const createPliersItemIntoDB = async (payLoad) => {
  console.log(payLoad);
  const result = await prisma.accountHead.createMany({
    data: payLoad,
  });

  return result;
};

const getAllPillerItem = async () => {
  const result = await prisma.accountHead.findMany({});

  return result;
};

export const PillersService = {
  createPliersItemIntoDB,
  getAllPillerItem,
};
