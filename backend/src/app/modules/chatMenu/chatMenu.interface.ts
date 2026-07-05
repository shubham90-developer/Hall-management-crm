import { Document, Types } from "mongoose";

export interface IChatMenu extends Document {
  categoryName: Types.ObjectId;
  itemName: string;
  price: string;
  status: string;
  isDeleted: boolean;
}
