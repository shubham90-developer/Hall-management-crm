import mongoose, { Schema } from "mongoose";
import { IVegitablesList } from "./vegitablesList.interface";

const VegitableListScheme: Schema = new Schema(
  {
    vegitablesName: {
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

export const VegitableList = mongoose.model<IVegitablesList>(
  "VegitableList",
  VegitableListScheme,
);
