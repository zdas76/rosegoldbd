import express from "express";
import { ReportControllers } from "./report.controllers";

const route = express.Router();

route.get("/ledger", ReportControllers.ladgerReport);

route.get("/party/:partyId", ReportControllers.partyReport);


route.get("/raw", ReportControllers.rawReport);

route.get("/raw/:id", ReportControllers.rawReportById);

route.get("/product", ReportControllers.productReport);

route.get("/product/:id", ReportControllers.productReportById);

route.get("/balance-sheet", ReportControllers.balanceSheet);

export const ReportRouter = route;