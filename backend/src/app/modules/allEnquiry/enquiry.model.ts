import mongoose, { Schema } from "mongoose";
import { IEnquiry } from "./enquiry.interface";
import { boolean } from "zod";

const EnquirySchema: Schema = new Schema(
  {
    customerName: {
      type: String,
    },
    mobileNo: {
      type: String,
    },
    alternateMobileNo: {
      type: String,
    },
    email: {
      type: String,
    },
    functionName: {
      type: Schema.Types.ObjectId,
      ref: "FunctionType",
    },
    date1: {
      type: Date,
    },
    date2: {
      type: Date,
    },
    date3: {
      type: Date,
    },
    guestCount: {
      type: Number,
    },
    notes: {
      type: String,
    },
    isJain: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Hold"],
      default: "Pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
      },
    },
  },
);

export const Enquiry = mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
