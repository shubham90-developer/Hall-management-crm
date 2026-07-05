import mongoose, { Schema } from "mongoose";
import { ITermsConditions } from "./termsConditions.interface";

const TermsConditionsSchema: Schema = new Schema(
  {
    content: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        if (ret.createdAt)
          ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        if (ret.updatedAt)
          ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
      },
    },
  },
);

export const TermsConditions = mongoose.model<ITermsConditions>(
  "TermsConditions",
  TermsConditionsSchema,
);
