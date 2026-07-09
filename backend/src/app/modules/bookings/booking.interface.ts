import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  bookingNo: string;
  enquiry: Types.ObjectId;
  address: String;
  gstNo: String;
  bookingDate: Date;
  functionDate: Date;
  functionType: Types.ObjectId;
  hall: Types.ObjectId;
  startTime: Number;
  endTime: Number;
  advance: Number;
  paymentMethod: String;
  status: "Confirmed" | "Pencil" | "Cancelled" | "Gst" | "NoGst";
  Muhurat: String;
  guests: Number;
  seatingArrangement: String;
  menu: Types.ObjectId[];
  sweets: Types.ObjectId[];
  additional: Types.ObjectId[];
  externalItems: Types.ObjectId[];
  other: { id: Types.ObjectId; startTime: string; endTime: string }[];
  starters: Types.ObjectId[];
  chatMenu: Types.ObjectId[];
  menuType?: "buffet" | "starters" | "chatmenu" | "customize";
  selectedBuffetId?: Types.ObjectId | null;
  totalAmount: Number;
  additionalAmount: Number;
  specialMenuAmount: Number;
  subtotalamount: Number;
  gst: Number;
  mealTime: string | null;
  grandTotal: Number;
  discount: Number;
  finalAmount: Number;
  pendingAmount: Number;
}
