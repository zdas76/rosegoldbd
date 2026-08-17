import express from "express";
import { JournalControllers } from "./journal.controllers";

const route = express.Router();

route.post("/purchase", JournalControllers.addPurcherReceived);

route.post("/sales", JournalControllers.createSalseVoucher);

route.post("/material-sale", JournalControllers.createMaterialSaleVoucher);

route.post("/received", JournalControllers.createReceiptdVoucher);

route.post("/payment", JournalControllers.createPaymentdVoucher);

route.post("/journal", JournalControllers.createJournalVoucher);

route.post("/contra", JournalControllers.createContraVoucher);

route.get("/ledgerTotal", JournalControllers.getTotalByAccountId);

// route.get("/:id", JournalControllers.getSingleJournal);
// route.put("/", JournalControllers.updateJournal);
// route.delete("/", JournalControllers.deleteJournal);

export const JournalRoute = route;
