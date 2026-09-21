import validationRequiest from "../../middlewares/validationRequest";
import { InventoryValidation } from "./invendoty.validation";
import { InventoryControllers } from "./inventories.controllers";
import express from "express";

const route = express.Router();

route.get("/", InventoryControllers.getnventory);

route.get("/inventorytotal", InventoryControllers.getInventoryAggigetValue);


route.put("/", InventoryControllers.updateInventory);

route.put("/", InventoryControllers.deleteInventory);

// get  last raw material rate
route.get("/lastRate", InventoryControllers.getLastRawMaterialRate);

route.get("/:id", InventoryControllers.getInventoryById);

export const InventoryRoute = route;
