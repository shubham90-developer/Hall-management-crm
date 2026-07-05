import mongoose, { Schema } from "mongoose";
import { IGst } from "./gst.interface";

const gstSchema = new Schema<IGst>(
  {
    gst: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
      },
    },
  },
);

export const Gst = mongoose.model<IGst>("Gst", gstSchema);
