import { Document } from "mongoose";

export interface IChatCategory extends Document {
  categoryName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
