"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRouter = void 0;
const express_1 = __importDefault(require("express"));
const production_controller_1 = require("./production.controller");
const router = express_1.default.Router();
router.get("/", production_controller_1.ProductionController.getProduction);
router.post("/", production_controller_1.ProductionController.createProduction);
router.put("/:id", production_controller_1.ProductionController.updateProduction);
router.delete("/:id", production_controller_1.ProductionController.deleteProduction);
exports.ProductionRouter = router;
