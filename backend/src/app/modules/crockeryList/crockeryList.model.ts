import mongoose, { Schema } from "mongoose";
import { ICrockeryList } from "./crockeryList.interface";

const CrockeryListScheme: Schema = new Schema(
  {
    crocekryName: {
      type: String,
      required: true,
      trim: true,
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

export const CrockeryList = mongoose.model<ICrockeryList>(
  "CrockeryList",
  CrockeryListScheme,
);
