import express from "express";
import { ProductIngradientControllers } from "./productIngradient.controller";
import validationRequiest from "../../middlewares/validationRequest";
import { ProductIngradientValidation } from "./productIngradient.validation";

const router = express.Router();

router.post(
  "/",
  validationRequiest(
    ProductIngradientValidation.createProductIngradientSchema
  ),
  ProductIngradientControllers.createProductIngradient
);

router.get("/", ProductIngradientControllers.getAllProductIngradients);

router.get(
  "/product/:productId",
  ProductIngradientControllers.getProductIngradientByProductId
);

router.get(
  "/:id",
  ProductIngradientControllers.getProductIngradientById
);

router.put(
  "/:id",
  validationRequiest(
    ProductIngradientValidation.updateProductIngradientSchema
  ),
  ProductIngradientControllers.updateProductIngradient
);

router.delete(
  "/:id",
  ProductIngradientControllers.deleteProductIngradient
);

export const ProductIngradientRoute = router;
