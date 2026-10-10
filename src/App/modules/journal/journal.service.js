 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import {

  Department,


  VoucherType,
} from "../../../generated/prisma/client";
import { GenerateVoucherNumber } from "../../../helpars/generateVoucherNumber";
import prisma from "../../../shared/prisma";

//Create Purchase Received Voucher
const createPurchestReceivedIntoDB = async (payload) => {
  const createPurchestVoucher = await prisma.$transaction(async (tx) => {
    const partyExists = await tx.party.findUnique({
      where: { id: payload.partyOrcustomerId },
    });
    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party found.`,
      );
    }
    const voucherNo = await GenerateVoucherNumber("PRV");

    // step 1. create transaction entries
    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          invoiceNo: payload.invoiceNo || null,
          voucherNo: voucherNo,
          date: payload.date,
          voucherType: VoucherType.PURCHASE,
          partyId: partyExists.id,
        },
      });

    // 2. create bank transaction
    const BankTXData




 = [];

    payload.creditItem.forEach((item) => {
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
    const inventoryData = payload.items.map((item) => {
      if (item.itemType === "RAW_MATERIAL") {
        return {
          transactionId: createTransactionInfo.id,
          date: payload.date,
          rawId: item.rawOrProductId,
          unitPrice: item.unitPrice || 0,
          department: Department.PURCHASE,
          quantityAdd: item.quantityAdd || 0,
          discount: _optionalChain([item, 'optionalAccess', _ => _.discount]) || 0,
          debitAmount: item.debitAmount,
        };
      } else {
        return {
          transactionId: createTransactionInfo.id,
          productId: item.rawOrProductId,
          unitPrice: item.unitPrice || 0,
          quantityAdd: item.quantityAdd || 0,
          discount: _optionalChain([item, 'optionalAccess', _2 => _2.discount]) || 0,
          date: payload.date,
          department: Department.PURCHASE,
          debitAmount: item.debitAmount,
        };
      }
    });

    //Step 3: Insert Inventory Records
    await Promise.all(
      inventoryData.map((item) =>
        tx.inventory.create({
          data: item,
        }),
      ),
    );
    let journalItem = [];
    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    payload.creditItem.forEach((item) =>
      journalItem.push({
        transectionId: createTransactionInfo.id,
        accountsItemId: Number(item.accountsItemId),
        creditAmount: Number(item.amount),
        narration: _nullishCoalesce(item.narration, () => ( "")),
        date: new Date(payload.date),
      }),
    );

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory",
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
      (total, item) => total + (Number(item.debitAmount) || 0),
      0,
    );

    const creditAmount = journalItem.reduce(
      (total, item) => total + (Number(item.creditAmount) || 0),
      0,
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

//Create Purchase Received Voucher
const createPurchestReceivedPackingMaterialIntoDB = async (payload) => {
  const createPurchestVoucher = await prisma.$transaction(async (tx) => {
    const partyExists = await tx.party.findUnique({
      where: { id: payload.partyOrcustomerId },
    });
    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party found.`,
      );
    }
    const voucherNo = await GenerateVoucherNumber("PRPMV");

    // step 1. create transaction entries
    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          invoiceNo: payload.invoiceNo || null,
          voucherNo: voucherNo,
          date: payload.date,
          voucherType: VoucherType.PURCHASE,
          partyId: partyExists.id,
        },
      });

    // 2. create bank transaction
    const BankTXData




 = [];

    payload.creditItem.forEach((item) => {
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
    const inventoryData = payload.items.map((item) => {
      return {
        transactionId: createTransactionInfo.id,
        date: payload.date,
        packingMaterialId: item.packingMaterialId,
        perUnitQty: item.perUnitQty,
        perUnitCost: item.perUnitCost,
        unitPrice: item.unitPrice || 0,
        integratedUnitPrice: item.integratedUnitPrice,
        department: Department.PURCHASE,
        quantityAdd: item.quantityAdd || 0,
        discount: _optionalChain([item, 'optionalAccess', _3 => _3.discount]) || 0,
        debitAmount: item.debitAmount,
        integratedDebitAmount: item.integratedDebitAmount,
      };
    });

    //Step 3: Insert Inventory Records
    await Promise.all(
      inventoryData.map((item) =>
        tx.pMInventory.create({
          data: item,
        }),
      ),
    );
    let journalItem = [];
    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    payload.creditItem.forEach((item) =>
      journalItem.push({
        transectionId: createTransactionInfo.id,
        accountsItemId: Number(item.accountsItemId),
        checkOrRTGS: item.checkOrRTGS,
        creditAmount: Number(item.amount),
        integratedCreditAmount: item.integratedCreditAmount,
        narration: _nullishCoalesce(item.narration, () => ( "")),
        date: new Date(payload.date),
      }),
    );

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory",
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
      (total, item) => total + (Number(item.debitAmount) || 0),
      0,
    );

    const creditAmount = journalItem.reduce(
      (total, item) => total + (Number(item.creditAmount) || 0),
      0,
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
const createSalesVoucher = async (payload) => {
  const createSalseVoucher = await prisma.$transaction(async (tx) => {
    let isParty = null;

    if (payload.partyType === "VENDOR") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyOrcustomerId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(`Invalid Vendor`);
      }
    }

    // step 1. create transaction entries
    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.SALES,
          partyId: _optionalChain([isParty, 'optionalAccess', _4 => _4.id]) || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData




 = [];

    for (const item of payload.debitItem) {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          debitAmount: _optionalChain([item, 'optionalAccess', _5 => _5.debitAmount]),
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
    const inventoryData = payload.salseItem.map((item) => ({
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
      inventoryData.map((item) =>
        tx.inventory.create({
          data: item,
        }),
      ),
    );

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    let journalItems = [];
    payload.debitItem.map((item) =>
      journalItems.push({
        transectionId: createTransactionInfo.id,
        accountsItemId: item.accountsItemId,
        date: payload.date,
        debitAmount: item.debitAmount,
        narration: _optionalChain([item, 'optionalAccess', _6 => _6.narration]) || "",
      }),
    );

    if (payload.totalDiscount && payload.totalDiscount > 0) {
      const discountItem = await tx.accountsItem.findFirst({
        where: {
          accountsItemName: {
            contains: "discount",
          },
        },
      });

      if (payload.totalDiscount && discountItem) {
        journalItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: parseInt(discountItem.id),
          debitAmount: payload.totalDiscount,
          narration: "Discount",
          date: payload.date,
        });
      }
    }

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory",
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
      (total, item) => total + (Number(item.debitAmount) || 0),
      0,
    );

    const creditAmount = journalItems.reduce(
      (total, item) => total + (Number(item.creditAmount) || 0),
      0,
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

const createMaterialSaleVoucher = async (payload) => {
  const createSalseVoucher = await prisma.$transaction(async (tx) => {
    let isParty = null;

    if (payload.partyType === "VENDOR") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyOrcustomerId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(`Invalid Vendor`);
      }
    }

    // step 1. create transaction entries
    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.SALES,
          partyId: _optionalChain([isParty, 'optionalAccess', _7 => _7.id]) || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData




 = [];

    for (const item of payload.debitItem) {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          debitAmount: _optionalChain([item, 'optionalAccess', _8 => _8.debitAmount]),
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
    const inventoryData = payload.salseItem.map((item) => ({
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
      inventoryData.map((item) =>
        tx.inventory.create({
          data: item,
        }),
      ),
    );

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    let journalItems = [];
    payload.debitItem.map((item) =>
      journalItems.push({
        transectionId: createTransactionInfo.id,
        accountsItemId: item.accountsItemId,
        date: payload.date,
        debitAmount: item.debitAmount,
        narration: _optionalChain([item, 'optionalAccess', _9 => _9.narration]) || "",
      }),
    );

    if (payload.totalDiscount && payload.totalDiscount > 0) {
      const discountItem = await tx.accountsItem.findFirst({
        where: {
          accountsItemName: {
            contains: "discount",
          },
        },
      });

      if (payload.totalDiscount && discountItem) {
        journalItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: parseInt(discountItem.id),
          debitAmount: payload.totalDiscount,
          narration: "Discount",
          date: payload.date,
        });
      }
    }

    const debiteAccountsId = await tx.accountsItem.findFirst({
      where: {
        accountsItemName: {
          contains: "inventory",
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
      (total, item) => total + (Number(item.debitAmount) || 0),
      0,
    );

    const creditAmount = journalItems.reduce(
      (total, item) => total + (Number(item.creditAmount) || 0),
      0,
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
const createPaymentVoucher = async (payload) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    let isParty = null;

    if (payload.partyType === "VENDOR" || "PARTY") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(
          `Invalid partyId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`,
        );
      }
    }

    // Create Transaction Voucher
    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.PAYMENT,
          partyId: _optionalChain([isParty, 'optionalAccess', _10 => _10.id]) || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData




 = [];

    payload.creditItem.map(async (item) => {
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

    const journalCreditItems





 = [];

    payload.creditItem.map((item) => {
      journalCreditItems.push({
        transectionId: createTransactionInfo.id,
        accountsItemId: item.accountsItemId,
        date: payload.date,
        creditAmount: Number(item.amount),
        narration: _optionalChain([item, 'optionalAccess', _11 => _11.narration]) || "",
      });
    });

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: Dabite Items must be a non-empty array");
    }

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalDebitItems






 = payload.debitItem.map((item) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      date: payload.date,
      debitAmount: Number(item.amount),
      narration: _optionalChain([item, 'optionalAccess', _12 => _12.narration]) || "",
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

const createReceiptVoucher = async (payload) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    let isParty = null;

    if (payload.partyType === "VENDOR" || "PARTY") {
      isParty = await tx.party.findFirst({
        where: {
          id: payload.partyId,
          isDeleted: false,
        },
      });

      if (!isParty) {
        throw new Error(
          `Invalid partyId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`,
        );
      }
    }

    // Create Transaction Voucher
    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.RECEIPT,
          partyId: _optionalChain([isParty, 'optionalAccess', _13 => _13.id]) || null,
          date: payload.date,
        },
      });

    // 2. create bank transaction
    const BankTXData




 = [];

    payload.debitItem.map(async (item) => {
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

    const journalDebitItems





 = [];

    payload.debitItem.map((item) => {
      if (!item.bankAccountId) {
        journalDebitItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: item.accountsItemId,
          date: payload.date,
          debitAmount: Number(item.amount),
          narration: _optionalChain([item, 'optionalAccess', _14 => _14.narration]) || "",
        });
      }
    });

    if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCreditItems = payload.creditItem.map((item) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      creditAmount: Number(item.amount),
      narration: _optionalChain([item, 'optionalAccess', _15 => _15.narration]) || "",
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

const createJournalVoucher = async (payload) => {
  const createJournal = await prisma.$transaction(async (tx) => {
    let partyExists;

    //check party
    if (payload.party) {
      partyExists = await tx.party.findFirst({
        where: { id: payload.partyId },
      });
    }

    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.JOURNAL,
          date: payload.date,
          partyId: _optionalChain([partyExists, 'optionalAccess', _16 => _16.id]) || null,
        },
      });

    //bank transaction
    let BankTXData;

    if (payload.debitBankId && payload.debitBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.debitBankId,
        date: payload.date,
        creditAmount: _optionalChain([payload, 'optionalAccess', _17 => _17.amount]),
      };
    }

    if (payload.creditBankId && payload.creditBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.creditBankId,
        date: payload.date,
        debitAmount: _optionalChain([payload, 'optionalAccess', _18 => _18.amount]),
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
          narration: _optionalChain([payload, 'optionalAccess', _19 => _19.narration]) || "",
        },
        {
          transectionId: createTransactionInfo.id,
          accountsItemId: payload.debitItem,
          date: new Date(payload.date),
          debitAmount: payload.amount,
          narration: _optionalChain([payload, 'optionalAccess', _20 => _20.narration]) || "",
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

const createQantaVoucher = async (payload) => {
  const createJournal = await prisma.$transaction(async (tx) => {
    let partyExists;
    //check party
    if (payload.party) {
      partyExists = await tx.party.findFirst({
        where: { id: payload.partyId },
      });
    }

    const createTransactionInfo =
      await tx.transactionInfo.create({
        data: {
          voucherNo: payload.voucherNo,
          voucherType: VoucherType.JOURNAL,
          partyId: _optionalChain([partyExists, 'optionalAccess', _21 => _21.id]) || null,
          date: payload.date,
        },
      });

    let BankTXData;

    if (payload.debitBankId && payload.debitBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.debitBankId,
        date: payload.date,
        debitAmount: _optionalChain([payload, 'optionalAccess', _22 => _22.amount]),
      };
    }

    if (payload.creditBankId && payload.creditBankId > 0) {
      BankTXData = {
        transectionId: createTransactionInfo.id,
        bankAccountId: payload.creditBankId,
        date: payload.date,
        creditAmount: _optionalChain([payload, 'optionalAccess', _23 => _23.amount]),
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
          narration: _optionalChain([payload, 'optionalAccess', _24 => _24.narration]) || "",
        },
        {
          transectionId: createTransactionInfo.id,
          accountsItemId: payload.debitItem,
          date: new Date(payload.date),
          debitAmount: payload.amount,
          narration: _optionalChain([payload, 'optionalAccess', _25 => _25.narration]) || "",
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

const getItemTotalByAccountId = async (payLoad) => {
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
  WHERE j.accountsItemId = ${payLoad.accountsItemId} AND  j.date >= ${
    _optionalChain([getDate, 'optionalAccess', _26 => _26.date]) || new Date(payLoad.date)
  } 
  GROUP BY j.accountsItemId`;

  return (result )[0];
};

export const JurnalService = {
  createPurchestReceivedIntoDB,
  createPurchestReceivedPackingMaterialIntoDB,
  createSalesVoucher,
  createMaterialSaleVoucher,
  createPaymentVoucher,
  createReceiptVoucher,
  createJournalVoucher,
  createQantaVoucher,
  getItemTotalByAccountId,
};
