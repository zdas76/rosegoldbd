import express from "express";
import { VoucherController } from "./transction.controllers";

const route = express.Router();

route.get("/", VoucherController.getAllVoucher);

route.get("/voucherNo/:voucherNo", VoucherController.getVoucherbyVoucherNo);
// et daily report
route.get("/dailyReport", VoucherController.getDailyReport);

route.get("/:id", VoucherController.getVoucherbyid);

export const VoucherRoute = route;

