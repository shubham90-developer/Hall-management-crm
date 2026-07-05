import { Document, Types } from "mongoose";

export interface IEnquiry extends Document {
  customerName: string;
  mobileNo: string;
  alternateMobileNo: string;
  email: string;
  functionName: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
