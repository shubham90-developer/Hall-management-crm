import { Document } from "mongoose";

export interface IOtherList extends Document {
  itemName: string;
  price: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
