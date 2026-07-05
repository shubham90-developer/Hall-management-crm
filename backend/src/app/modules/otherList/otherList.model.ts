import mongoose, { Schema } from "mongoose";
import { IOtherList } from "./otherList.interface";

const OtherListScheme: Schema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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

export const OtherList = mongoose.model<IOtherList>(
  "OtherList",
  OtherListScheme,
);
