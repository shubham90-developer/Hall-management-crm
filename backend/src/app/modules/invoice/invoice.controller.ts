import { NextFunction, Request, Response } from "express";
import Invoice, { InvoiceCounter } from "./invoice.model";
import Booking from "../bookings/booking.model";
import { appError } from "../../errors/appError";
import {
  CreateInvoiceValidation,
  UpdateInvoiceValidation,
} from "./invoice.validation";

export const calculatePricing = (
  totalAmount: number,
  additionalAmount: number,
  gst: number,
  discount: number,
  advance: number,
) => {
  const subtotalamount = totalAmount + additionalAmount;
  const grandTotal = subtotalamount + gst;
  const finalAmount = grandTotal - discount;
  const pendingAmount = finalAmount - advance;

  return { subtotalamount, grandTotal, finalAmount, pendingAmount };
};
const populateInvoice = (query: any) =>
  query.populate({
    path: "booking",
    populate: [
      {
        path: "enquiry",
        populate: { path: "functionName", model: "FunctionType" },
      },
      { path: "functionType" },
      { path: "hall" },
      { path: "sweets" },
      { path: "additional" },
      { path: "other.id" },
    ],
  });

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      booking,
      guests,
      baseGuests,
      totalAmount,
      additionalAmount,
      gst,
      discount,
      advance,
    } = CreateInvoiceValidation.parse(req.body);

    const bookingExists = await Booking.findById(booking);
    if (!bookingExists) {
      next(new appError("Booking not found", 404));
      return;
    }

    const finalAdvance = advance ?? Number(bookingExists.advance || 0);

    const { subtotalamount, grandTotal, finalAmount, pendingAmount } =
      calculatePricing(
        totalAmount,
        additionalAmount,
        gst,
        discount,
        finalAdvance,
      );

    const counter = await InvoiceCounter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    const invoiceNo = `INV-${String(counter!.seq).padStart(4, "0")}`;

    const newInvoice = new Invoice({
      invoiceNo,
      booking,
      guests,
      baseGuests: baseGuests ?? guests,
      totalAmount,
      additionalAmount,
      gst,
      discount,
      advance: finalAdvance,
      subtotalamount,
      grandTotal,
      finalAmount,
      pendingAmount,
    });

    await newInvoice.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Invoice created successfully",
      data: newInvoice,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invoices = await populateInvoice(
      Invoice.find({ status: { $ne: "Cancelled" } }).sort({ createdAt: 1 }),
    );

    res.json({
      success: true,
      statusCode: 200,
      message:
        invoices.length > 0
          ? "Invoices retrieved successfully"
          : "No invoices found",
      data: invoices,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invoice = await populateInvoice(Invoice.findById(req.params.id));

    if (!invoice) {
      next(new appError("Invoice not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Invoice retrieved successfully",
      data: invoice,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invoiceId = req.params.id as string;

    const existingInvoice = await Invoice.findById(invoiceId);
    if (!existingInvoice) {
      next(new appError("Invoice not found", 404));
      return;
    }

    const parsed = UpdateInvoiceValidation.parse(req.body);

    const totalAmount =
      parsed.totalAmount ?? Number(existingInvoice.totalAmount);
    const additionalAmount =
      parsed.additionalAmount ?? Number(existingInvoice.additionalAmount);
    const gst = parsed.gst ?? Number(existingInvoice.gst);
    const discount = parsed.discount ?? Number(existingInvoice.discount);
    const advance = parsed.advance ?? Number(existingInvoice.advance);

    const { subtotalamount, grandTotal, finalAmount, pendingAmount } =
      calculatePricing(totalAmount, additionalAmount, gst, discount, advance);

    const updatedInvoice = await populateInvoice(
      Invoice.findByIdAndUpdate(
        invoiceId,
        {
          $set: {
            ...parsed,
            subtotalamount,
            grandTotal,
            finalAmount,
            pendingAmount,
          },
        },
        { new: true, runValidators: true },
      ),
    );

    res.json({
      success: true,
      statusCode: 200,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const cancelInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      next(new appError("Invoice not found", 404));
      return;
    }

    if (invoice.status === "Cancelled") {
      next(new appError("Invoice is already cancelled", 400));
      return;
    }

    invoice.status = "Cancelled";
    await invoice.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Invoice cancelled successfully",
      data: invoice,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      next(new appError("Invoice not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Invoice deleted successfully",
      data: deletedInvoice,
    });
    return;
  } catch (error) {
    next(error);
  }
};
