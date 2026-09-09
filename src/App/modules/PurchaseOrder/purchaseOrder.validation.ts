import z from "zod";

const purchaseOrderInventoryItem = z.object({
  productId: z.number().optional(),
  rawId: z.number().optional(),
  unitPrice: z.number().default(0),
  quantity: z.number().default(0),
  amount: z.number().optional(),
  status: z
    .enum(["ACTIVE", "DELETED", "PUSH", "BLOCK", "PENDING", "CHECKED", "CLOSED", "CONVERTED"])
    .optional(),
});

const createPurchaseOrder = z.object({
  body: z.object({
    orderNo: z.string({ message: "Order Number is required" }).trim(),
    date: z.string().datetime().or(z.date()).optional(),
    partyId: z.number().optional(),
    status: z
      .enum(["ACTIVE", "DELETED", "PUSH", "BLOCK", "PENDING", "CHECKED", "CLOSED", "CONVERTED"])
      .optional(),
    purchaseOrder: z.array(purchaseOrderInventoryItem).optional(),
  }),
});

const updatePurchaseOrder = z.object({
  body: z.object({
    orderNo: z.string().trim().optional(),
    date: z.string().datetime().or(z.date()).optional(),
    partyId: z.number().optional(),
    status: z
      .enum(["ACTIVE", "DELETED", "PUSH", "BLOCK", "PENDING", "CHECKED", "CLOSED", "CONVERTED"])
      .optional(),
    purchaseOrder: z.array(purchaseOrderInventoryItem).optional(),
  }),
});

export const purchaseOrderValidaton = {
  createPurchaseOrder,
  updatePurchaseOrder,
};