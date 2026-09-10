import z from "zod";

const purchaseOrderInventoryItemSchema = z.object({
  productId: z.number().optional(),
  rawId: z.number().optional(),
  unitPrice: z.number().default(0),
  quantity: z.number().default(0),
  amount: z.number().optional(),
});

const createPurchaseOrderSchema = z.object({
  date: z.string(),
  partyId: z.number(),
  inventory: z.array(purchaseOrderInventoryItemSchema).optional(),
});

export type PurchaseOrderInventoryItem = z.infer<
  typeof purchaseOrderInventoryItemSchema
>;
export type CreatePurchaseOrder = z.infer<typeof createPurchaseOrderSchema>;

const updatePurchaseOrderSchema = z.object({
  date: z.string().datetime().or(z.date()).optional(),
  partyId: z.number().optional(),
  status: z
    .enum([
      "ACTIVE",
      "DELETED",
      "PUSH",
      "BLOCK",
      "PENDING",
      "CHECKED",
      "CLOSED",
      "CONVERTED",
    ])
    .optional(),
  PurchaseOrderInventory: z.array(purchaseOrderInventoryItemSchema).optional(),
});

export type UpdatePurchaseOrder = z.infer<typeof updatePurchaseOrderSchema>;

export const purchaseOrderValidaton = {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
};
