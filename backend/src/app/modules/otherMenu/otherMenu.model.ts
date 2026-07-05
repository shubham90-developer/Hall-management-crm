import mongoose, { Schema } from "mongoose";
import { IOtherMenu } from "./otherMenu.interface";

const OtherMenuSchema: Schema = new Schema(
  {
    buffetName: [
      {
        type: Schema.Types.ObjectId,
        ref: "BuffetName",
      },
    ],
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

export const OtherMenu = mongoose.model<IOtherMenu>(
  "OtherMenu",
  OtherMenuSchema,
);
