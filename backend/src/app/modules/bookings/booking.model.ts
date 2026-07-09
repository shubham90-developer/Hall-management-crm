import mongoose, { Schema } from "mongoose";
import { IBooking } from "./booking.interface";

const CounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});
export const Counter = mongoose.model("BookingCounter", CounterSchema);

const BookingSchema = new Schema<IBooking>(
  {
    bookingNo: { type: String, unique: true },
    enquiry: {
      type: Schema.Types.ObjectId,
      ref: "Enquiry",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gstNo: {
      type: String,
      default: null,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    functionDate: {
      type: Date,
      required: true,
    },
    functionType: {
      type: Schema.Types.ObjectId,
      ref: "FunctionType",
      required: true,
    },
    hall: {
      type: Schema.Types.ObjectId,
      ref: "HallType",
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    advance: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pencil", "Cancelled"],
      default: "Confirmed",
    },
    Muhurat: {
      type: String,
      default: null,
    },
    guests: {
      type: Number,
      default: 0,
    },
    seatingArrangement: {
      type: String,
      default: null,
    },
    menu: [
      {
        type: Schema.Types.ObjectId,
        ref: "MenuList",
      },
    ],
    sweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "SweetMenu",
      },
    ],
    additional: [
      {
        type: Schema.Types.ObjectId,
        ref: "OtherMenu",
      },
    ],
    starters: [
      {
        type: Schema.Types.ObjectId,
        ref: "StartersMenu",
      },
    ],
    chatMenu: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatMenu",
      },
    ],
    menuType: {
      type: String,
      enum: ["buffet", "starters", "chatmenu", "customize"],
      default: "buffet",
    },
    selectedBuffetId: {
      type: Schema.Types.ObjectId,
      ref: "BuffetName",
      default: null,
    },
    specialMenuAmount: {
      type: Number,
      default: 0,
    },
    externalItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "ExternalItems",
      },
    ],
    other: [
      {
        id: { type: Schema.Types.ObjectId, ref: "OtherList" },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    additionalAmount: {
      type: Number,
      default: 0,
    },
    mealTime: {
      type: String,
      default: null,
    },
    subtotalamount: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
