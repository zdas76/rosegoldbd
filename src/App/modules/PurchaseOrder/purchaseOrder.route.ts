import express from "express";
import { PurchaseOrderControllers } from "./purchaseOrder.controllers";
import validationRequiest from "../../middlewares/validationRequest";
import { purchaseOrderValidaton } from "./purchaseOrder.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const route = express.Router();

route.post(
  "/",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  // validationRequiest(purchaseOrderValidaton.createPurchaseOrderSchema),
  PurchaseOrderControllers.createPurchaseOrder,
);

route.get(
  "/",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  PurchaseOrderControllers.getAllPurchaseOrders,
);

route.get(
  "/:id",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  PurchaseOrderControllers.getPurchaseOrderById,
);

route.put(
  "/:id",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validationRequiest(purchaseOrderValidaton.updatePurchaseOrderSchema),
  PurchaseOrderControllers.updatePurchaseOrderById,
);

route.delete(
  "/:id",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PurchaseOrderControllers.deletePurchaseOrderById,
);

export const PurchaseOrderRoute = route;
