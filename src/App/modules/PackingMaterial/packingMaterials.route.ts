import express from "express";
import { PackingMaterialControllers } from "./packingMaterials.controller";

const router = express.Router();

router.post("/", PackingMaterialControllers.createPackingMaterial);
router.post("/many", PackingMaterialControllers.createPackingMaterialsMany);
router.get("/", PackingMaterialControllers.getAllPackingMaterial);
router.get("/:id", PackingMaterialControllers.getPackingMaterialById);
router.put("/:id", PackingMaterialControllers.updatePackingMaterialById);
router.delete("/:id", PackingMaterialControllers.deletePackingMaterialById);

export const PackingMaterialRoute = router;
