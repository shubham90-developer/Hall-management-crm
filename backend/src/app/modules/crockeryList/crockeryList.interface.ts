import { Document } from "mongoose";

export interface ICrockeryList extends Document {
  crocekryName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
