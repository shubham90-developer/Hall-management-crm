import { Document } from "mongoose";

export interface IGrosaryList extends Document {
  grosaryName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
