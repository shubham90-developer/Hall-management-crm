import { Document } from "mongoose";

export interface IGst extends Document {
  gst: number;
  hallGst: number;
  createdAt: Date;
  updatedAt: Date;
}
