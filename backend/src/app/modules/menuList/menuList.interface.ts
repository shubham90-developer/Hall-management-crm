import { Document, Types } from "mongoose";

export interface IMenuList extends Document {
  buffetName: Types.ObjectId[];
  categoryName: Types.ObjectId;
  itemName: string;
  crocekryName: Types.ObjectId[];
  qty: string;
  grosaryName: Types.ObjectId[];
  vegitablesName: Types.ObjectId[];
  menuImage: string;
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
