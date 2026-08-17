import { ItemType, Status } from "../../../../generated/prisma";

export type TcreateProduct = {
  id: number;
  name: string;
  description: string;
  subCategoryId: number;
  unitId: number;
  minPrice?: number | null;
  color?: string | null;
  size?: string | null;
  itemType: ItemType;
  isDeleted: boolean;
  status: Status;
  initialStock: {
    quantity: number;
    unitPrice: number;
    amount: number;
    date: Date;
  };
  createdAt: Date;
  updateAt: Date;
};
