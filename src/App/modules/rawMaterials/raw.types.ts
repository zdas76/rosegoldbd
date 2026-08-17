import { ItemType, Status } from "../../../../generated/prisma";

type Inventory = {
  date: string;
  unitPrice: number;
  quantityAdd: number;
  debitAmount: number;
  isClosing: boolean;
};

export type TrawMaterial = {
  id?: number;
  unitId: any;
  name: string;
  itemType: ItemType;
  createdAt: Date;
  description: string | null;
  isDeleted?: boolean;
  quantity: number;
  unitPrice: number;
  amount: number;
  date: Date;
  status: Status;
  updateAt: Date;
  inventory: Inventory[]; // ✅ updated
};
