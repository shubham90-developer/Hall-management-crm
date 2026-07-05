import mongoose, { Schema } from "mongoose";
import { IExternalItems } from "./externalItems.interface";

const externalItemsSchema = new Schema<IExternalItems>(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    buffet: {
      type: Schema.Types.ObjectId,
      ref: "BuffetName",
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

export const ExternalItems = mongoose.model<IExternalItems>(
  "ExternalItems",
  externalItemsSchema,
);
