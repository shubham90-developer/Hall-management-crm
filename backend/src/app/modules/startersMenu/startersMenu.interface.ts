import { Document, Types } from "mongoose";

export interface IStartersMenu extends Document {
  categoryName: Types.ObjectId;
  itemName: string;
  price: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
