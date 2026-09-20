import express from "express";
import { ProductionIngredientControllers } from "./productionIngredient.controller";
import validationRequiest from "../../middlewares/validationRequest";
import { ProductionIngredientValidation } from "./productionIngredient.validation";

const router = express.Router();

router.post(
  "/",
  validationRequiest(
    ProductionIngredientValidation.createProductionIngredientSchema
  ),
  ProductionIngredientControllers.createProductionIngredient
);

router.get("/", ProductionIngredientControllers.getAllProductionIngredients);

router.get(
  "/:id",
  ProductionIngredientControllers.getProductionIngredientById
);

router.put(
  "/:id",
  validationRequiest(
    ProductionIngredientValidation.updateProductionIngredientSchema
  ),
  ProductionIngredientControllers.updateProductionIngredient
);

router.delete(
  "/:id",
  ProductionIngredientControllers.deleteProductionIngredient
);

export const ProductionIngredientRoute = router;
