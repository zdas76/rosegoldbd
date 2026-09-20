import { z } from "zod";

const createProductionIngredientSchema = z.object({
  body: z.object({
    productionName: z
      .string({
        message: "Production name is required",
      })
      .trim()
      .min(1, "Production name cannot be empty"),
    type: z.enum(["SOAP", "DETERGENT", "KITCHENBAR"]).optional(),
    rawMaterialIds: z.array(z.number()).optional(),
    rawMaterials: z
      .array(
        z.union([
          z.number(),
          z.object({
            id: z.number().optional(),
            rawId: z.number().optional(),
          }),
        ])
      )
      .optional(),
  }),
});

const updateProductionIngredientSchema = z.object({
  body: z.object({
    productionName: z
      .string({
        message: "Production name is required",
      })
      .trim()
      .min(1, "Production name cannot be empty")
      .optional(),
    type: z.enum(["SOAP", "DETERGENT", "KITCHENBAR"]).optional(),
    rawMaterialIds: z.array(z.number()).optional(),
    rawMaterials: z
      .array(
        z.union([
          z.number(),
          z.object({
            id: z.number().optional(),
            rawId: z.number().optional(),
          }),
        ])
      )
      .optional(),
  }),
});

export const ProductionIngredientValidation = {
  createProductionIngredientSchema,
  updateProductionIngredientSchema,
};
