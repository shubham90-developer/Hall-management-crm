import { NextFunction, Request, Response } from "express";
import { Gst } from "./gst.model";
import { appError } from "../../errors/appError";

export const getGst = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let gst = await Gst.findOne();
    if (!gst) {
      await Gst.create({
        gst: 5,
      });
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "gst retrived successfully",
      data: gst,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGst = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { gst } = req.body;

    const updateGst = await Gst.findOneAndUpdate({}, { gst }, { new: true });

    if (!updateGst) {
      return res.status(404).json({
        success: false,
        message: "GST document not found",
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "GST updated successfully",
      data: updateGst,
    });
  } catch (error) {
    next(error);
  }
};
