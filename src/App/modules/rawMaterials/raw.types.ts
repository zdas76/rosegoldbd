import { Status } from "../../../generated/prisma";

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
  date?: Date | string;
  name: string;
  description: string | null;
  quantity: number;
  alertQuantity: number;
  unitPrice: number;
  amount: number;
  status: Status;
  isDeleted?: boolean;
  createdAt: Date;
  updateAt?: Date;
  inventory?: Inventory[];
};
