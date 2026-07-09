import { Document, Types } from "mongoose";

export interface IEnquiry extends Document {
  customerName: string;
  mobileNo: string;
  alternateMobileNo: string;
  email: string;
  functionName: Types.ObjectId;
  date1: Date;
  date2?: Date;
  date3?: Date;
  guestCount: number;
  notes?: string;
  status: "Pending" | "Confirmed" | "Hold";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
