import express from "express";
import { ProductionController } from "./production.controller";

const router = express.Router();

router.get("/", ProductionController.getProduction);

router.post("/", ProductionController.createProduction);

router.put("/:id", ProductionController.updateProduction);

router.delete("/:id", ProductionController.deleteProduction);

export const ProductionRouter = router;
