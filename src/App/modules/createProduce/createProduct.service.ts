import { ItemType, VoucherType } from "../../../../generated/prisma/enums";
import prisma from "../../../shared/prisma";

const createProductInfo = async (payLoad: any) => {
  const addProduct = await prisma.$transaction(async (tx) => {
    // create Transaction
    const createTransaction = await tx.transactionInfo.create({
      data: {
        voucherNo: payLoad.voucherNo,
        voucherType: VoucherType.CREATEPRODUCT,
      },
    });

    // 2. check product item
    const isProductExisted = await prisma.product.findFirst({
      where: {
        id: payLoad.product.productId,
        itemType: ItemType.PRODUCT,
        isDeleted: false,
      },
    });

    if (!isProductExisted) {
      throw new Error(`Product not found.`);
    }

    const productInventory = {
      productId: isProductExisted.id,
      date: new Date(payLoad.date),
      transactionId: createTransaction.id,
      quantityAdd: payLoad.product.quantity,
      unitPrice: payLoad.product.unitcost,
      debitAmount: payLoad.product.amount,
    };

    // 3. Check Raw Materials
    const isRawMaterialExisted = payLoad.rawMaterials.map(
      async (item: {
        rawMaterialsId: number;
        rawUnitprice: number;
        totalAmount: number;
        quantity: number;
      }) =>
        await prisma.product.findFirst({
          where: {
            id: item.rawMaterialsId,
            itemType: ItemType.RAW_MATERIAL,
            isDeleted: false,
          },
        })
    );

    if (!isRawMaterialExisted) {
      throw new Error(`Invalid raw material.`);
    }
    const rowMaterialInventory = payLoad.rawMaterials.map(
      (item: {
        rawMaterialsId: number;
        rawUnitprice: number;
        amount: number;
        quantity: number;
        date: string;
      }) => ({
        rawId: item.rawMaterialsId,
        transactionId: createTransaction.id,
        date: new Date(payLoad.date),
        quantityLess: item.quantity,
        unitPrice: item.rawUnitprice,
        creditAmount: item.amount,
      })
    );
    const InventoryItem = [...rowMaterialInventory, productInventory];

    await tx.inventory.createMany({
      data: InventoryItem,
    });

    // Step 3: Prepare Journal Credit Entries (For Payment Accounts)
    const costItemsJournal = payLoad.expenses.map((item: any) => ({
      transectionId: createTransaction.id,
      accountsItemId: item.accountsItemId,
      date: new Date(payLoad.date),
      debitAmount: item.amount,
      narration: item.narration || "",
    }));

    await tx.journal.createMany({
      data: costItemsJournal,
    });

    return createTransaction;
  });
  const getCreatedProduct = await prisma.transactionInfo.findFirst({
    where: {
      id: addProduct.id,
    },
    include: {
      journal: true,
    },
  });


  return getCreatedProduct;
};

export const CreateProductServices = {
  createProductInfo,
};
