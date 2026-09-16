 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { VoucherType } from "@prisma/client";
import prisma from "../shared/prisma";

export const GenerateVoucherNumber = async (type) => {
  let voucherNo;

  if (type === "PRV") {
    const lastVoucher = await prisma.transactionInfo.findFirst({
      where: { voucherType: VoucherType.PURCHASE },
      orderBy: { id: "desc" },
      select: { voucherNo: true },
    });
    voucherNo = _optionalChain([lastVoucher, 'optionalAccess', _ => _.voucherNo]);
  }

  if (type === "PO") {
    const lastVoucher = await prisma.purchaseOrderInfo.findFirst({
      orderBy: { id: "desc" },
      select: { orderNo: true },
    });

    voucherNo = _optionalChain([lastVoucher, 'optionalAccess', _2 => _2.orderNo]);
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

const getNextNumber = (voucherNo) => {
  const parts = voucherNo.split("-");
  const lastNumber = parseInt(parts[1]);
  const nextNumber = (lastNumber + 1).toString().padStart(4, "0");
  return nextNumber;
};

const currectDate = new Date().getDate().toString().padStart(2, "0");
const currectMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
const currectYear = new Date().getFullYear().toString().slice(-2);

const currentDate = currectDate + currectMonth + currectYear;
