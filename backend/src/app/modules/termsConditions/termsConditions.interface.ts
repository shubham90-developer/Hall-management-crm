import { Document } from "mongoose";

export interface ITermsConditions extends Document {
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
