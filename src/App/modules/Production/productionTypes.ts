export interface Production {
  date: string;
  batchNo: string;
  productinfo: {
    productId: number;
    quantity?: number;
    unitPrice?: number;
  };
  rawMaterials?: [
    {
      id?: number;
      rawId: number;
      quantity: number;
      unitPrice: number;
    },
  ];
  productionExpenses?: [
    {
      id?: number;
      proExpencesItemId: number;
      unitRate: number;
      expDuration: number;
      amount: number;
    },
  ];
  packingMaterials?: [
    {
      id?: number;
      packingMaterialId: number;
      unitPrice: number;
      Qty: number;
      perUnitQty: number;
      perUnitCost: number;
    },
  ];
}
