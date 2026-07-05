import { Document } from "mongoose";

export interface IHallType extends Document {
  hallName: string;
  status: string;
  isBooked: Boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
