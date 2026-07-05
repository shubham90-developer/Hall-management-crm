import mongoose, { Schema } from "mongoose";
import { IEnquiry } from "./enquiry.interface";

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
