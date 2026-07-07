import mongoose, { Schema } from "mongoose";
import { IInvoice } from "./invoice.interface";

const InvoiceCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});
export const InvoiceCounter = mongoose.model(
  "InvoiceCounter",
  InvoiceCounterSchema,
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNo: { type: String, unique: true },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    guests: { type: Number, default: 0 },
    baseGuests: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    additionalAmount: { type: Number, default: 0 },
    subtotalamount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;
