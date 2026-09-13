import express from "express";
import { PackageController } from "./package.controller";

const router = express.Router();

router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.post("/", PackageController.createPackage);
router.put("/:id", PackageController.updatePackage);
router.delete("/:id", PackageController.deletePackage);

export const PackageRouter = router;
