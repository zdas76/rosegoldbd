import { AccountsItem } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const getAccountLedgerReport = async (payload: {
  accountsItemId: number;
  startDate: string | null;
  endDate: string | null;
}) => {
  const accountsItemId = Number(payload.accountsItemId);
  const { startDate, endDate } = payload;

  const isExisted = await prisma.accountsItem.findFirst({
    where: {
      id: accountsItemId,
    },
  });

  if (!isExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Accounts Item not found");
  }
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : undefined;

  if (start && end) {
    const result = await prisma.journal.findMany({
      where: {
        accountsItemId: accountsItemId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: "asc",
      },
      select: {
        accountsItem: true,
        date: true,
        debitAmount: true,
        creditAmount: true,
        narration: true,
      },
    });

    return result;
  } else {
    const result = await prisma.journal.findMany({
      where: {
        accountsItemId: accountsItemId,
      },
      orderBy: {
        date: "asc",
      },
      select: {
        accountsItem: true,
        date: true,
        debitAmount: true,
        creditAmount: true,
        narration: true,
      },
    });
    return result;
  }
};

const partyLedgerReport = async (payload: {
  partyId: number;
  startDate: string | null;
  endDate: string | null;
  partyType: string;
}) => {

  const partyId = Number(payload.partyId);
  const { startDate, endDate } = payload;

  if (!partyId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Party Id is required");
  }

  const party = await prisma.party.findFirst({
    where: { id: partyId },
  });

  if (!party) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Party not found");
  }

  let accountsItemId: number | undefined;

  if (payload.partyType === 'PARTY') {
    const accountsItem: AccountsItem | null = await prisma.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "accounts receivable",
        },
      },
    });
    accountsItemId = accountsItem?.id
  } else if (payload.partyType === 'VENDOR') {
    const accountsItems: AccountsItem | null = await prisma.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "accounts payable",
        },
      },
    });
    accountsItemId = accountsItems?.id

  }

  if (!accountsItemId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Accounts Item not found");
  }

  const result = await prisma.journal.findMany({
    where: {
      transactionInfo: {
        partyId: party.id,
      },
      accountsItemId: accountsItemId,

      date: {
        gte: startDate ? new Date(startDate) : (party.openingDate || new Date()),
        lte: endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : new Date(),
      },
    },
    include: {
      transactionInfo: {
        select: {
          voucherNo: true,
          partyId: true,
          voucherType: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });


  return { party, result };

}

// raw report
const rawReport = async (payload: {
  startDate?: string | null;
  endDate?: string | null;
}) => {


  const allrawMaterial = await prisma.rawMaterial.findMany({
    where: {
      isDeleted: false
    },
  });
  if (allrawMaterial.length < 1) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Raw Material not found");
  }
  const result = Promise.all(allrawMaterial.map(async (rawMaterial) => {

    const startDate = payload?.startDate ? payload?.startDate : rawMaterial?.openingDate;
    const endDate = payload?.endDate ? payload?.endDate : new Date();

    console.log(startDate, endDate)
    const total = await prisma.inventory.aggregate({
      _sum: {
        debitAmount: true,
        creditAmount: true,
        quantityAdd: true,
        quantityLess: true,
      },
      where: {
        rawId: rawMaterial.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        }
      },
    })

    return { rawMaterial, total }
  }))

  return result;
};

const getRawReportById = async (id: number, payload: {
  startDate?: string | null;
  endDate?: string | null;
}) => {
  const rawMaterial = await prisma.rawMaterial.findUnique({
    where: {
      id: id,
    },
  });

  if (!rawMaterial) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Raw Material not found");
  }

  const startDate = payload?.startDate ? payload?.startDate : rawMaterial?.openingDate;
  const endDate = payload?.endDate ? payload?.endDate : new Date();

  const report = await prisma.inventory.findMany({

    where: {
      rawId: rawMaterial.id,
      date: {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      }
    },
    include: {
      transactionInfo: {
        select: {
          id: true,
          voucherNo: true,
          voucherType: true,
        },
      },
    }
  })

  return { rawMaterial, report };
};

const productReport = async (payload: {
  startDate?: string | null;
  endDate?: string | null;
}) => {


  const allProduct = await prisma.product.findMany({
    where: {
      isDeleted: false
    },
  });
  if (allProduct.length < 1) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product not found");
  }
  const result = Promise.all(allProduct.map(async (product) => {

    const startDate = payload?.startDate ? payload?.startDate : product?.openingDate || "";
    const endDate = payload?.endDate ? payload?.endDate : new Date();

    const total = await prisma.inventory.aggregate({
      _sum: {
        debitAmount: true,
        creditAmount: true,
        quantityAdd: true,
        quantityLess: true,
      },
      where: {
        productId: product.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        }

      },
    })
    return { product, total }
  }))

  return result;
};

const getProductReportById = async (id: number, payload: {
  startDate?: string | null;
  endDate?: string | null;
}) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!product) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product not found");
  }

  const report = await prisma.inventory.findMany({

    where: {
      productId: product.id,
      date: {
        gte: product.openingDate || new Date(payload?.startDate || ""),
        lte: payload?.endDate ? new Date(new Date(payload.endDate).setHours(23, 59, 59, 999)) : new Date()
      }

    },
  })

  return { product, report };
};


const getBalanceSheet = async (date: string | null) => {
  const targetDate = date ? new Date(new Date(date).setHours(23, 59, 59, 999)) : new Date();
  // Helper to get total debit/credit for an account name up to the target date
  const getAccountBalance = async (accountNameContains: string) => {
    const account = await prisma.accountsItem.findFirst({
      where: { accountsItemName: { contains: accountNameContains } },
    });

    if (!account) return { debit: 0, credit: 0, accountId: 0 };
    const result = await prisma.journal.aggregate({
      _sum: {
        debitAmount: true,
        creditAmount: true,
      },
      where: {
        accountsItemId: account.id,
        date: {
          lte: targetDate,
        },
      },
    });

    const debit = result._sum.debitAmount || 0;
    const credit = result._sum.creditAmount || 0;

    // Most asset accounts: Debit - Credit
    // Most liability accounts: Credit - Debit
    return { debit, credit, accountId: account.id };
  };

  // 1. Assets

  // Cash in Hand (Asset: Debit - Credit)
  const cashInHandData = await getAccountBalance("cash in hand");
  const cashInHand = cashInHandData.debit - cashInHandData.credit;

  // Cash at Bank (Asset: Debit - Credit)
  const cashAtBankData = await getAccountBalance("cash at bank");
  let cashAtBank = cashAtBankData.debit - cashAtBankData.credit;

  // If "cash at bank" isn't a single account, we can alternatively aggregate BankTransaction
  const bankTransactions = await prisma.bankTransaction.aggregate({
    _sum: {
      debitAmount: true,
      creditAmount: true,
    },
    where: {
      date: { lte: targetDate },
    },
  });
  const bankBalance = (bankTransactions._sum.debitAmount || 0) - (bankTransactions._sum.creditAmount || 0);

  // Prefer ledger balance, fallback to bank transactions logic depending on system usage
  if (!cashAtBankData.accountId) {
    cashAtBank = bankBalance;
  }

  // Accounts Receivable (Asset: Debit - Credit)
  const accountsReceivableData = await getAccountBalance("accounts receivable");
  const accountsReceivable = accountsReceivableData.debit - accountsReceivableData.credit;

  // Closing Stock / Inventory (Asset: value of stock)
  // Value = (quantityAdd * unitPrice) - (quantityLess * unitPrice)
  const inventoryData = await prisma.inventory.findMany({
    where: {
      date: { lte: targetDate },
      status: "ACTIVE"
    },
  });

  let closingStock = 0;
  for (const inv of inventoryData) {
    const qtyAdded = inv.quantityAdd || 0;
    const qtyLess = inv.quantityLess || 0;
    const price = inv.unitPrice || 0;

    // We assume unitPrice is the value per unit for both addition and deduction
    closingStock += (qtyAdded * price) - (qtyLess * price);
  }

  // Fallback if inventory logic is simpler in aggregate
  const inventoryAggregate = await prisma.inventory.aggregate({
    _sum: {
      debitAmount: true,
      creditAmount: true,
    },
    where: { date: { lte: targetDate } }
  });

  // If the system tracks stock value via debit/credit in Inventory
  const inventoryValueViaLedger = (inventoryAggregate._sum.debitAmount || 0) - (inventoryAggregate._sum.creditAmount || 0);
  if (closingStock === 0 && inventoryValueViaLedger !== 0) {
    closingStock = inventoryValueViaLedger;
  }


  const totalAssets = cashInHand + cashAtBank + accountsReceivable + closingStock;

  // 2. Liabilities

  // Accounts Payable (Liability: Credit - Debit)
  const accountsPayableData = await getAccountBalance("accounts payable");
  const accountsPayable = accountsPayableData.credit - accountsPayableData.debit;

  const totalLiabilities = accountsPayable;

  // 3. Equity
  // Simplest equity formula: Equity = Assets - Liabilities
  // Alternatively, query a "Capital" account
  const capitalData = await getAccountBalance("capital");
  let equity = capitalData.credit - capitalData.debit;

  if (equity === 0) {
    equity = totalAssets - totalLiabilities;
  }

  return {
    asOfDate: targetDate,
    assets: {
      cashInHand,
      cashAtBank,
      accountsReceivable,
      closingStock,
    },
    liabilities: {
      accountsPayable,
    },
    equity: {
      calculateEquity: totalAssets - totalLiabilities,
      capitalAccount: capitalData.credit - capitalData.debit,
      totalEquity: equity
    },
    totals: {
      totalAssets,
      totalLiabilities,
    }
  };
};

export const ReportService = {
  getAccountLedgerReport,
  partyLedgerReport,
  rawReport,
  getRawReportById,
  productReport,
  getProductReportById,
  getBalanceSheet,
};
