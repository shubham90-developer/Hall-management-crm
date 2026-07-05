import { Router } from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  cancelInvoice,
  deleteInvoice,
} from "./invoice.controller";

const router = Router();

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.patch("/:id", updateInvoice);
router.patch("/:id/cancel", cancelInvoice);
router.delete("/:id", deleteInvoice);

export const invoiceRouter = router;
