import { Document, Types } from "mongoose";

export interface IExternalItems extends Document {
  itemName: string;
  buffet: Types.ObjectId;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
