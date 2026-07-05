import { Document } from "mongoose";

export interface IVegitablesList extends Document {
  vegitablesName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
