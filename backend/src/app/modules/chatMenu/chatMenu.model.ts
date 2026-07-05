import mongoose, { Schema } from "mongoose";
import { IChatMenu } from "./chatMenu.interface";

const ChatMenuSchema: Schema = new Schema(
  {
    categoryName: {
      type: Schema.Types.ObjectId,
      ref: "ChatCategory",
      required: true,
    },
    itemName: {
      type: String,
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

export const ChatMenu = mongoose.model<IChatMenu>("ChatMenu", ChatMenuSchema);
