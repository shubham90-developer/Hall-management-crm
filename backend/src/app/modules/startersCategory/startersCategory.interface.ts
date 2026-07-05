import { Document } from "mongoose";

export interface IStartersCategory extends Document {
  categoryName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
