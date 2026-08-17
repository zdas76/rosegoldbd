import express from "express";
import { RawMaterialControllers } from "./raw.Controllers";

const route = express.Router();

route.post("/", RawMaterialControllers.createRawMaterial);

route.get("/", RawMaterialControllers.getAllRawMaterial);

route.get("/:id", RawMaterialControllers.getRawMaterialById);

route.put("/:id", RawMaterialControllers.updateRawMaterialById);

route.delete("/:id", RawMaterialControllers.deleteRawMaterialById);

export const RawMaterialRoute = route;
