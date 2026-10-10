export interface Production {
  date: string;
  batchNo: string;
  productinfo: {
    productId: number;
    quantityAdd?: number;
    unitPrice?: number;
  };
  rawMaterials?: {
    rawId: number;
    quantity: number;
    unitPrice: number;
  }[];
  productionExpenses?: {
    proExpencesItemId: number;
    unitRate: number;
    expDuration: number;
    amount: number;
  }[];
  packingMaterials?: {
    packingMaterialId: number;
    unitPrice: number;
    Qty: number;
    perUnitQty: number;
    perUnitCost: number;
  }[];
  products?: {
    productId: number;
    quantityAdd?: number;
    quantityLess?: number;
    unitPrice: number;
  }[];
}
