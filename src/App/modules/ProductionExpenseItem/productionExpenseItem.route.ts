import express from "express";
import { ProductionExpenseItemControllers } from "./productionExpenseItem.controller";

const router = express.Router();

router.post("/", ProductionExpenseItemControllers.createProductionExpenseItem);
router.post(
  "/many",
  ProductionExpenseItemControllers.createProductionExpenseItemsMany
);
router.get("/", ProductionExpenseItemControllers.getAllProductionExpenseItems);
router.get(
  "/:id",
  ProductionExpenseItemControllers.getProductionExpenseItemById
);
router.put(
  "/:id",
  ProductionExpenseItemControllers.updateProductionExpenseItemById
);
router.delete(
  "/:id",
  ProductionExpenseItemControllers.deleteProductionExpenseItemById
);

export const ProductionExpenseItemRoute = router;
