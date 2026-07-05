import mongoose, { Schema } from "mongoose";
import { IStartersMenu } from "./startersMenu.interface";

const StartersMenuSchema: Schema = new Schema(
  {
    categoryName: {
      type: Schema.Types.ObjectId,
      ref: "StartersCategory",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: String,
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

export const StartersMenu = mongoose.model<IStartersMenu>(
  "StartersMenu",
  StartersMenuSchema,
);
