import { AccountsItem, Party, TransactionInfo, VoucherType } from "../../../../generated/prisma/browser";
import prisma from "../../../shared/prisma";


//Create Purchase Received Voucher
const createPurchestReceivedIntoDB = async (payload: any) => {


  const createPurchestVoucher = await prisma.$transaction(async (tx) => {
    const partyExists = await tx.party.findUnique({
      where: { id: payload.partyOrcustomerId },
    });


    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party found.`
      );
    }

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          invoiceNo: payload.invoiceNo || null,
          voucherNo: payload.voucherNo,
          date: payload.date,
          voucherType: VoucherType.PURCHASE,
          partyId: partyExists.id,
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      creditAmount: number;
      date: Date;
    }[] = [];

    payload.creditItem.forEach((item: any) => {
      if (item.bankId !== null) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankId,
          date: payload.date,
          creditAmount: item.amount,
        });
      }
    });

    if (BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    //step 3: Prepare Inventory Data
    const inventoryData = payload.items.map((item: any) => {
      if (item.itemType === "RAW_MATERIAL") {
        return {
          transactionId: createTransactionInfo.id,
          date: payload.date,
          rawId: item.rawOrProductId,
          unitPrice: item.unitPrice || 0,
          quantityAdd: item.quantityAdd || 0,
          discount: item?.discount || 0,
          debitAmount: item.debitAmount,
        };
      } else {
        return {
          transactionId: createTransactionInfo.id,
          productId: item.rawOrProductId,
          unitPrice: item.unitPrice || 0,
          quantityAdd: item.quantityAdd || 0,
          discount: item?.discount || 0,
          date: payload.date,
          debitAmount: item.debitAmount,
        };
      }
    });

    //Step 3: Insert Inventory Records
    await Promise.all(
      inventoryData.map((item: any) =>
        tx.inventory.create({
          data: item,
        })
      )
    );
    let journalItem: any[] = [];
    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    payload.creditItem.forEach((item: any) => journalItem.push({
      transectionId: createTransactionInfo.id,
      accountsItemId: Number(item.accountsItemId),
      creditAmount: Number(item.amount),
      narration: item.narration ?? "",
      date: new Date(payload.date),
    }));

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory"
        },
      },
    });

    if (!debiteAccountsId) {
      throw new Error("Inventory Accounts Item not found");
    }

    journalItem.push({
      transectionId: createTransactionInfo.id,
      accountsItemId: debiteAccountsId.id,
      debitAmount: payload.grandTotal,
      narration: "Purchase Inventory Received",
      date: new Date(payload.date),

    });

    const debitAmount = journalItem.reduce(
      (total: number, item: any) => total + (Number(item.debitAmount) || 0),
      0
    );

    const creditAmount = journalItem.reduce(
      (total: number, item: any) => total + (Number(item.creditAmount) || 0),
      0
    );


    if (debitAmount !== creditAmount) {
      throw new Error("Debit and Credit amounts do not match");
    }

    //Step 8: Insert Journal Records
    await tx.journal.createMany({
      data: journalItem,
    });
    return createTransactionInfo;
  });
  return createPurchestVoucher;
};

// create Salse Voucher
const createSalesVoucher = async (payload: any) => {
  const createSalseVoucher = await prisma.$transaction(async (tx) => {

    let isParty: Party | null = null;

    if (payload.partyType === "VENDOR") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyOrcustomerId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(
          `Invalid Vendor`
        );
      }
    }

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.SALES,
          partyId: isParty?.id || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      debitAmount: number;
      date: Date;
    }[] = [];

    for (const item of payload.debitItem) {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          debitAmount: item?.debitAmount,
        });
      }
    }

    if (BankTXData && BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.salseItem) || payload.salseItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    // step 2: prepiar inventory data
    const inventoryData = payload.salseItem.map((item: any) => ({
      transactionId: createTransactionInfo.id,
      productId: item.rawOrProductId,
      date: payload.date,
      unitPrice: item.unitPrice || 0,
      quantityLess: item.quantity || 0,
      discount: item.discount || 0,
      creditAmount: item.creditAmount,
    }));

    //Step 3: Insert Inventory Records
    await Promise.all(
      inventoryData.map((item: any) =>
        tx.inventory.create({
          data: item,
        })
      )
    );

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    let journalItems = [];
    payload.debitItem.map((item: any) => journalItems.push({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      date: payload.date,
      debitAmount: item.debitAmount,
      narration: item?.narration || "",
    }));

    if (payload.totalDiscount && payload.totalDiscount > 0) {
      const discountItem: AccountsItem | any = await tx.accountsItem.findFirst({
        where: {
          accountsItemName: {
            contains: "discount",
          },
        },
      });

      if (payload.totalDiscount && discountItem) {
        journalItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: parseInt(discountItem.id!),
          debitAmount: payload.totalDiscount,
          narration: "Discount",
          date: payload.date,
        });
      }
    }

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory"
        },
      },
    });

    if (!debiteAccountsId) {
      throw new Error("Inventory Accounts Item not found");
    }

    journalItems.push({
      transectionId: createTransactionInfo.id,
      accountsItemId: debiteAccountsId.id,
      creditAmount: payload.grandTotal,
      narration: "Purchase Inventory Received",
      date: new Date(payload.date),

    });

    const debitAmount = journalItems.reduce(
      (total: number, item: any) => total + (Number(item.debitAmount) || 0),
      0
    );

    const creditAmount = journalItems.reduce(
      (total: number, item: any) => total + (Number(item.creditAmount) || 0),
      0
    );


    if (debitAmount !== creditAmount) {
      throw new Error("Debit and Credit amounts do not match");
    }


    await tx.journal.createMany({
      data: journalItems,
    });
    return createTransactionInfo;
  });

  return createSalseVoucher;
};

const createMaterialSaleVoucher = async (payload: any) => {
  const createSalseVoucher = await prisma.$transaction(async (tx) => {

    let isParty: Party | null = null;

    if (payload.partyType === "VENDOR") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyOrcustomerId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(
          `Invalid Vendor`
        );
      }
    }

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.SALES,
          partyId: isParty?.id || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      debitAmount: number;
      date: Date;
    }[] = [];

    for (const item of payload.debitItem) {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          debitAmount: item?.debitAmount,
        });
      }
    }

    if (BankTXData && BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.salseItem) || payload.salseItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }
    // step 2: prepiar inventory data
    const inventoryData = payload.salseItem.map((item: any) => ({
      transactionId: createTransactionInfo.id,
      rawId: item.rawOrProductId,
      date: payload.date,
      unitPrice: item.unitPrice || 0,
      quantityLess: item.quantity || 0,
      discount: item.discount || 0,
      creditAmount: item.creditAmount,
    }));

    //Step 3: Insert Inventory Records
    await Promise.all(
      inventoryData.map((item: any) =>
        tx.inventory.create({
          data: item,
        })
      )
    );

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    let journalItems = [];
    payload.debitItem.map((item: any) => journalItems.push({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      date: payload.date,
      debitAmount: item.debitAmount,
      narration: item?.narration || "",
    }));

    if (payload.totalDiscount && payload.totalDiscount > 0) {
      const discountItem: AccountsItem | any = await tx.accountsItem.findFirst({
        where: {
          accountsItemName: {
            contains: "discount",
          },
        },
      });

      if (payload.totalDiscount && discountItem) {
        journalItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: parseInt(discountItem.id!),
          debitAmount: payload.totalDiscount,
          narration: "Discount",
          date: payload.date,
        });
      }
    }

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory"
        },
      },
    });

    if (!debiteAccountsId) {
      throw new Error("Inventory Accounts Item not found");
    }

    journalItems.push({
      transectionId: createTransactionInfo.id,
      accountsItemId: debiteAccountsId.id,
      creditAmount: payload.grandTotal,
      narration: "Purchase Inventory Received",
      date: new Date(payload.date),

    });

    const debitAmount = journalItems.reduce(
      (total: number, item: any) => total + (Number(item.debitAmount) || 0),
      0
    );

    const creditAmount = journalItems.reduce(
      (total: number, item: any) => total + (Number(item.creditAmount) || 0),
      0
    );


    if (debitAmount !== creditAmount) {
      throw new Error("Debit and Credit amounts do not match");
    }


    await tx.journal.createMany({
      data: journalItems,
    });
    return createTransactionInfo;
  });

  return createSalseVoucher;
};
// Create Payment Voucher
const createPaymentVoucher = async (payload: any) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    let isParty: Party | null = null;

    if (payload.partyType === "VENDOR" || "PARTY") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(
          `Invalid partyId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`
        );
      }
    }

    // Create Transaction Voucher
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.PAYMENT,
          partyId: isParty?.id || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      creditAmount: number;
      date: Date;
    }[] = [];

    payload.creditItem.map(async (item: any) => {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          creditAmount: Number(item.amount),
        });
      }
    });

    if (BankTXData && BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    const journalCreditItems: {
      transectionId: number;
      accountsItemId: number;
      date: string;
      creditAmount: number;
      narration: string;
    }[] = [];

    payload.creditItem.map((item: any) => {
      journalCreditItems.push({
        transectionId: createTransactionInfo.id,
        accountsItemId: item.accountsItemId,
        date: payload.date,
        creditAmount: Number(item.amount),
        narration: item?.narration || "",
      });
    });

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: Dabite Items must be a non-empty array");
    }

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalDebitItems: {
      transectionId: number;
      accountsItemId: number;
      partyId: number | null;
      date: string;
      creditAmount: number;
      narration: string;
    }[] = payload.debitItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      date: payload.date,
      debitAmount: Number(item.amount),
      narration: item?.narration || "",
    }));

    const journalItems = [...journalDebitItems, ...journalCreditItems];

    await tx.journal.createMany({
      data: journalItems,
    });
    return createTransactionInfo.id;
  });

  const result = await prisma.transactionInfo.findFirst({
    where: { id: createVoucher },
  });
  return result;
};

const createReceiptVoucher = async (payload: any) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    let isParty: Party | null = null;

    if (payload.partyType === "VENDOR" || "PARTY") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(
          `Invalid partyId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`
        );
      }
    }

    // Create Transaction Voucher
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.RECEIPT,
          partyId: isParty?.id || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      debitAmount: number;
      date: Date;
    }[] = [];

    payload.debitItem.map(async (item: any) => {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          debitAmount: Number(item.amount),
        });
      }
    });

    if (BankTXData && BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    const journalDebitItems: {
      transectionId: number;
      accountsItemId: number;
      debitAmount: number;
      narration: string;
      date: string;
    }[] = [];

    payload.debitItem.map((item: any) => {
      if (!item.bankAccountId) {
        journalDebitItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: item.accountsItemId,
          date: payload.date,
          debitAmount: Number(item.amount),
          narration: item?.narration || "",
        });
      }
    });

    if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCreditItems = payload.creditItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      creditAmount: Number(item.amount),
      narration: item?.narration || "",
      date: payload.date,
    }));

    const journalItems = [...journalDebitItems, ...journalCreditItems];

    await tx.journal.createMany({
      data: journalItems,
    });
    return createTransactionInfo.id;
  });

  const result = await prisma.transactionInfo.findFirst({
    where: {
      id: createVoucher,
    },
  });
  return result;
};

const createJournalVoucher = async (payload: any) => {
  const createJournal = await prisma.$transaction(async (tx) => {
    let partyExists;

    //check party
    if (payload.party) {
      partyExists = await tx.party.findFirst({
        where: { id: payload.partyId },
      });
    }

    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.JOURNAL,
          date: payload.date,
          partyId: partyExists?.id || null,
        },
      });

    //bank transaction
    let BankTXData;

    if (payload.debitBankId && payload.debitBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.debitBankId,
        date: payload.date,
        creditAmount: payload?.amount,
      };
    }

    if (payload.creditBankId && payload.creditBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.creditBankId,
        date: payload.date,
        debitAmount: payload?.amount,
      };
    }

    if (BankTXData) {
      await tx.bankTransaction.create({
        data: BankTXData,
      });
    }

    await tx.journal.createMany({
      data: [
        {
          transectionId: createTransactionInfo.id,
          accountsItemId: payload.creditItem,
          date: new Date(payload.date),
          creditAmount: payload.amount,
          narration: payload?.narration || "",
        },
        {
          transectionId: createTransactionInfo.id,
          accountsItemId: payload.debitItem,
          date: new Date(payload.date),
          debitAmount: payload.amount,
          narration: payload?.narration || "",
        },
      ],
    });

    return createTransactionInfo;
  });

  const result = await prisma.transactionInfo.findFirst({
    where: {
      id: createJournal.id,
    },
  });

  return result;
};

const createQantaVoucher = async (payload: any) => {
  const createJournal = await prisma.$transaction(async (tx) => {
    let partyExists;
    //check party
    if (payload.party) {
      partyExists = await tx.party.findFirst({
        where: { id: payload.partyId },
      });
    }

    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.JOURNAL,
          partyId: partyExists?.id || null,
          date: payload.date,
        },
      });

    let BankTXData;

    if (payload.debitBankId && payload.debitBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.debitBankId,
        date: payload.date,
        debitAmount: payload?.amount,
      };
    }

    if (payload.creditBankId && payload.creditBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.creditBankId,
        date: payload.date,
        creditAmount: payload?.amount,
      };
    }

    if (BankTXData) {
      await tx.bankTransaction.create({
        data: BankTXData,
      });
    }

    await tx.journal.createMany({
      data: [
        {
          transectionId: createTransactionInfo.id,
          accountsItemId: payload.creditItem,
          date: new Date(payload.date),
          creditAmount: payload.amount,
          narration: payload?.narration || "",
        },
        {
          transectionId: createTransactionInfo.id,
          accountsItemId: payload.debitItem,
          date: new Date(payload.date),
          debitAmount: payload.amount,
          narration: payload?.narration || "",
        },
      ],
    });

    return createTransactionInfo;
  });

  const result = await prisma.transactionInfo.findFirst({
    where: {
      id: createJournal.id,
    },
  });

  return result;
};

const getItemTotalByAccountId = async (payLoad: any) => {
  const getDate = await prisma.journal.findFirst({
    where: {
      accountsItemId: Number(payLoad.productId),
      isClosing: true,
    },

    orderBy: [{ id: "desc" }],
  });

  const result = await prisma.$queryRaw`
  
SELECT 
j.accountsItemId,
 
 SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
    
  FROM journals j
  LEFT JOIN transaction_info t ON t.id = j.transectionId
  WHERE j.accountsItemId = ${payLoad.accountsItemId} AND  j.date >= ${getDate?.date || new Date(payLoad.date)
    } 
  GROUP BY j.accountsItemId`;

  return (result as any[])[0];
};

export const JurnalService = {
  createPurchestReceivedIntoDB,
  createSalesVoucher,
  createMaterialSaleVoucher,
  createPaymentVoucher,
  createReceiptVoucher,
  createJournalVoucher,
  createQantaVoucher,
  getItemTotalByAccountId,
};
