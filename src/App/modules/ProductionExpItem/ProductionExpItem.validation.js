import { z } from "zod";

const createProductionExpItemSchema = z.object({
  body: z.object({
    expItemName: z
      .string({
        message: "Expense item name is required",
      })
      .min(1, "Expense item name cannot be empty"),
    // expDuration: z.number().optional().default(0),
    unitRate: z.number().optional().default(0),
  }),
});

const updateProductionExpItemSchema = z.object({
  body: z.object({
    expItemName: z.string().min(1, "Expense item name cannot be empty").optional(),
    // expDuration: z.number().optional(),
    unitRate: z.number().optional(),
  }),
});

export const ProductionExpItemValidation = {
  createProductionExpItemSchema,
  updateProductionExpItemSchema,
};
