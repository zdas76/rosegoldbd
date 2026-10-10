import express from "express";
import { ProductionExpItemControllers } from "./ProductionExpItem.controller";
import validationRequiest from "../../middlewares/validationRequest";
import { ProductionExpItemValidation } from "./ProductionExpItem.validation";

const router = express.Router();

router.post(
  "/",
  validationRequiest(ProductionExpItemValidation.createProductionExpItemSchema),
  ProductionExpItemControllers.createProductionExpItem
);

router.post(
  "/many",
  ProductionExpItemControllers.createProductionExpItemsMany
);

router.get("/", ProductionExpItemControllers.getAllProductionExpItems);

router.get("/:id", ProductionExpItemControllers.getProductionExpItemById);

router.put(
  "/:id",
  validationRequiest(ProductionExpItemValidation.updateProductionExpItemSchema),
  ProductionExpItemControllers.updateProductionExpItemById
);

router.delete("/:id", ProductionExpItemControllers.deleteProductionExpItemById);

export const ProductionExpItemRoute = router;
