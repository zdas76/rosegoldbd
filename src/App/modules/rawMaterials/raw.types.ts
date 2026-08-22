import { Status } from "@prisma/client";

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
  createdAt: Date;
  description: string | null;
  isDeleted?: boolean;
  quantity: number;
  unitPrice: number;
  amount: number;
  date?: Date | string;
  status: Status;
  updateAt: Date;
  inventory: Inventory[]; // ✅ updated
};
