import { Document, Types } from "mongoose";

export interface ISweetMenu extends Document {
  buffetName: Types.ObjectId[];
  itemName: string;
  price: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
