import mongoose, { Schema } from "mongoose";
import { IChatCategory } from "./chat.interface";

const ChatCategorySchema: Schema = new Schema(
  {
    categoryName: {
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

export const ChatCategory = mongoose.model<IChatCategory>(
  "ChatCategory",
  ChatCategorySchema,
);
