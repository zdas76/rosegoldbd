"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherRoute = void 0;
const express_1 = __importDefault(require("express"));
const transction_controllers_1 = require("./transction.controllers");
const route = express_1.default.Router();
route.get("/", transction_controllers_1.VoucherController.getAllVoucher);
route.get("/voucherNo/:voucherNo", transction_controllers_1.VoucherController.getVoucherbyVoucherNo);
// et daily report
route.get("/dailyReport", transction_controllers_1.VoucherController.getDailyReport);
route.get("/:id", transction_controllers_1.VoucherController.getVoucherbyid);
exports.VoucherRoute = route;
