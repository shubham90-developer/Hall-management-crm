import mongoose, { Schema } from "mongoose";
import { IMenuList } from "./menuList.interface";

const MenuListScheme: Schema = new Schema(
  {
    buffetName: [
      {
        type: Schema.Types.ObjectId,
        ref: "BuffetName",
      },
    ],
    categoryName: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
    },
    itemName: {
      type: String,
      required: true,
    },
    crocekryName: [
      {
        item: { type: Schema.Types.ObjectId, ref: "CrockeryList" },
        qty: { type: String, default: "" },
      },
    ],
    qty: {
      type: String,
    },
    grosaryName: [
      {
        item: { type: Schema.Types.ObjectId, ref: "GrosaryList" },
        qty: { type: String, default: "" },
      },
    ],
    vegitablesName: [
      {
        item: { type: Schema.Types.ObjectId, ref: "VegitableList" },
        qty: { type: String, default: "" },
      },
    ],
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

export const MenuList = mongoose.model<IMenuList>("MenuList", MenuListScheme);
