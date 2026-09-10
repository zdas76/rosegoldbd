import prisma from "../shared/prisma";

export const GenerateVoucherNumber = async (type: string) => {
  let voucherNo;

  if (type === "PO") {
    const lastVoucher = await prisma.purchaseOrderInfo.findFirst({
      orderBy: { id: "desc" },
      select: { orderNo: true },
    });

    voucherNo = lastVoucher?.orderNo;
  }

  if (voucherNo) {
    const nextNumber = getNextNumber(voucherNo);

    const result = type + "-" + currentDate + "/" + nextNumber;

    console.log(result);

    return result;
  } else {
    const number = "0001";
    const result = type + "-" + currentDate + "/" + number;
    return result;
  }
};

const getNextNumber = (voucherNo: string) => {
  const parts = voucherNo.split("-");
  const lastNumber = parseInt(parts[1]);
  const nextNumber = (lastNumber + 1).toString().padStart(4, "0");
  return nextNumber;
};

const currectDate = new Date().getDate().toString().padStart(2, "0");
const currectMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
const currectYear = new Date().getFullYear().toString().slice(-2);

const currentDate = currectDate + currectMonth + currectYear;
