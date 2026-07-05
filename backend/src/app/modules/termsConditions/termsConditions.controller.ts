import { NextFunction, Request, Response } from "express";

import {
  termsConditionsUpdateValidation,
  termsConditionsValidation,
} from "./termsConditions.validation";
import { appError } from "../../errors/appError";
import { TermsConditions } from "./termsConditions.model";

export const createTermsConditions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = termsConditionsValidation.parse(req.body);
    const termsConditions = new TermsConditions(validated);
    await termsConditions.save();
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Terms and conditions created successfully",
      data: termsConditions,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTermsConditions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search } = req.query as Record<string, string>;
    const filter: Record<string, any> = { isDeleted: false };
    if (search) {
      filter.content = new RegExp(search, "i");
    }
    const notes = await TermsConditions.find(filter).sort({ updatedAt: -1 });
    res.json({
      success: true,
      statusCode: 200,
      message: "Terms and conditions retrieved successfully",
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getTermsConditionsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const termsConditions = await TermsConditions.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!termsConditions) {
      next(new appError("terms Conditions not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Note retrieved successfully",
      data: termsConditions,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTermsConditionsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = termsConditionsUpdateValidation.parse(req.body);
    const updated = await TermsConditions.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      validated,
      { new: true },
    );
    if (!updated) {
      next(new appError("Terms Conditions not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Note updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTermsConditionsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const termsConditions = await TermsConditions.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
    if (!termsConditions) {
      next(new appError("Terms Conditions not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Note deleted successfully",
      data: termsConditions,
    });
  } catch (error) {
    next(error);
  }
};
