import { Document } from "mongoose";

export interface IFunctionType extends Document {
  functionName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
