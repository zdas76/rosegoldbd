import prisma from "../shared/prisma";

export const GenerateBatchNo = async (productId: number) => {
  let batchNo;

  const lastbatchByid = await prisma.transactionInfo.findFirst({
    where: {
      batchNo: {
        not: null,
      },
      inventory: {
        some: {
          productId: Number(productId),
        },
      },
    },
    include: {
      inventory: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (lastbatchByid) {
    batchNo = lastbatchByid.batchNo;
  }

  const currectYear = new Date().getFullYear().toString().slice(-2);

  if (batchNo) {
    const nextNumber = getNextNumber(batchNo);
    const result = productId + "-" + currectYear + "-" + nextNumber;
    return result;
  } else {
    const number = "0001";
    const result = productId + "-" + currectYear + "-" + number;
    return result;
  }
};

const getNextNumber = (batchNo: string) => {
  const lastNumber = batchNo.split("-").at(-1);
  const nextNumber = (lastNumber! + 1).toString().padStart(4, "0");
  return nextNumber;
};
