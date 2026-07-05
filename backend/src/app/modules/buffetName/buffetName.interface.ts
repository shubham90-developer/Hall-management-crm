import { Document } from "mongoose";

export interface IBuffetName extends Document {
  buffetName: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
