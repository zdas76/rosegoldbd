import { z } from "zod";

const createProductIngradientSchema = z.object({
  body: z.object({
    productId: z.number({
      message: "Product ID is required",
    }),
    rawMaterialIds: z.array(z.number()).optional(),
    rawMaterials: z
      .array(
        z.union([
          z.number(),
          z.object({
            id: z.number().optional(),
            rawId: z.number().optional(),
            ingredienteQty: z.number().optional(),
          }),
        ])
      )
      .optional(),
    packingMaterialIds: z.array(z.number()).optional(),
    packingMaterials: z
      .array(
        z.union([
          z.number(),
          z.object({
            id: z.number().optional(),
            packingId: z.number().optional(),
            ingredienteQty: z.number().optional(),
          }),
        ])
      )
      .optional(),
  }),
});

const updateProductIngradientSchema = z.object({
  body: z.object({
    productId: z.number().optional(),
    rawMaterialIds: z.array(z.number()).optional(),
    rawMaterials: z
      .array(
        z.union([
          z.number(),
          z.object({
            id: z.number().optional(),
            rawId: z.number().optional(),
            ingredienteQty: z.number().optional(),
          }),
        ])
      )
      .optional(),
    packingMaterialIds: z.array(z.number()).optional(),
    packingMaterials: z
      .array(
        z.union([
          z.number(),
          z.object({
            id: z.number().optional(),
            packingId: z.number().optional(),
            ingredienteQty: z.number().optional(),
          }),
        ])
      )
      .optional(),
  }),
});

export const ProductIngradientValidation = {
  createProductIngradientSchema,
  updateProductIngradientSchema,
};
