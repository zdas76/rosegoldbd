import { Status } from "@prisma/client";

export type TcreateProduct = {
  id: number;
  name: string;
  description: string;
  subCategoryId: number;
  unitId: number;
  minPrice?: number | null;
  color?: string | null;
  size?: string | null;
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
