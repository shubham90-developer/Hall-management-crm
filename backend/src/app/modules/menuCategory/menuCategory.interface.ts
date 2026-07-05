import { Document } from "mongoose";

export interface IMenuCategory extends Document {
  categoryName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
