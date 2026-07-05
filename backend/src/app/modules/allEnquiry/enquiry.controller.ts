import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";

import { Enquiry } from "./enquiry.model";
import { enquirySchema, enquiryUpdateValidation } from "./enquiry.validation";
import { FunctionType } from "../functionType/functionType.model";
import mongoose from "mongoose";

export const createEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { customerName, mobileNo, alternateMobileNo, email, functionName } =
      req.body;

    // exixting
    const existingEnquiry = await Enquiry.findOne({
      customerName,
      mobileNo,
      alternateMobileNo,
      email,
      functionName,
    });

    if (existingEnquiry) {
      next(new appError("Enquiry already exists", 400));
      return;
    }

    // validate

    const validateDate = enquirySchema.parse({
      customerName,
      mobileNo,
      alternateMobileNo,
      email,
      functionName,
    });

    // create

    const fname = await FunctionType.findById(functionName);

    if (!fname) {
      return next(new appError("Function Name not found", 404));
    }

    const createEnquiry = new Enquiry(validateDate);
    await createEnquiry.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Enquiry created successfully",
      data: createEnquiry,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getEnquiries = await Enquiry.find()
      .populate("functionName", "functionName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getEnquiries.length > 0
          ? "Enquiry retrieved successfully"
          : "No Enquiry Found",
      data: getEnquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return next(new appError("Invalid enquiry id", 400));
    }

    const getEnquiry = await Enquiry.findById(id).populate(
      "functionName",
      "functionName",
    );

    if (!getEnquiry) {
      return next(new appError("Enquiry not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Enquiry retrieved successfully",
      data: getEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const searchEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, phone } = req.query;

    if (!name && !phone) {
      next(new appError("Please provide name or phone number", 400));
      return;
    }

    if (phone) {
      const enquiries = await Enquiry.find({
        $or: [
          { mobileNo: { $regex: phone, $options: "i" } },
          { alternateMobileNo: { $regex: phone, $options: "i" } },
        ],
      }).populate("functionName", "functionName");

      if (enquiries.length === 0) {
        next(new appError("No enquiry found with this phone number", 404));
        return;
      }

      res.json({
        success: true,
        statusCode: 200,
        message: "Enquiries retrieved successfully",
        data: enquiries,
      });
      return;
    }

    if (name) {
      const enquiries = await Enquiry.find({
        customerName: { $regex: name, $options: "i" },
      }).populate("functionName", "functionName");

      if (enquiries.length === 0) {
        next(new appError("No enquiry found with this name", 404));
        return;
      }

      res.json({
        success: true,
        statusCode: 200,
        message: "Enquiries retrieved successfully",
        data: enquiries,
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const updateEnquiriesById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const EnquiriesById = req.params.id;
    // const { buffetName, itemName, price } = req.body;

    // validate

    const validatedData = enquiryUpdateValidation.parse(req.body);

    const upateEnquiries = await Enquiry.findOneAndUpdate(
      { _id: EnquiriesById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!upateEnquiries) {
      next(new appError("enquiries not found", 404));
      return;
    }

    await upateEnquiries.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "enquiries updated successfully",
      data: upateEnquiries,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiriesById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const enquiryDelete = await Enquiry.findOneAndDelete({
      _id: req.params.id,
    });

    if (!enquiryDelete) {
      next(new appError("enquiries not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "enquiries deleted successfully",
      data: enquiryDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
