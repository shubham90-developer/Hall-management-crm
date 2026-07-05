import { Document, Types } from "mongoose";

export interface IInvoice extends Document {
  invoiceNo: string;
  booking: Types.ObjectId;
  guests: Number;
  totalAmount: Number;
  additionalAmount: Number;
  subtotalamount: Number;
  gst: Number;
  discount: Number;
  grandTotal: Number;
  finalAmount: Number;
  advance: Number;
  pendingAmount: Number;
  status: "Active" | "Cancelled";
}
