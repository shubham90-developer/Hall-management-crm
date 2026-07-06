import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";

import { BuffetName } from "../buffetName/buffetName.model";
import { OtherMenu } from "./otherMenu.model";
import {
  otherMenuSchema,
  otherMenuUpdateValidation,
} from "./otherMenu.validation";

export const createOtherMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { buffetName, itemName, price } = req.body;

    // exixting
    const existingOtherMenu = await OtherMenu.findOne({
      buffetName,
      itemName,
      price,
    });

    if (existingOtherMenu) {
      next(new appError("Other Menu already exists", 400));
      return;
    }

    // validate

    const validateDate = otherMenuSchema.parse({
      buffetName,
      itemName,
      price,
    });

    // create

    const name = await BuffetName.findById(buffetName);

    if (!name) {
      return next(new appError("Buffet Name not found", 404));
    }

    const createOtherMenu = new OtherMenu(validateDate);
    await createOtherMenu.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Other menu created successfully",
      data: createOtherMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllOtherMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getOtherMenu = await OtherMenu.find()
      .populate("buffetName", "buffetName")
      .sort({
        createdAt: 1,
      });

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu Category retrieved successfully",
      data: getOtherMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getOtherMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getOtherMenu = await OtherMenu.findOne({
      _id: req.params.id,
    }).populate("buffetName", "buffetName");

    if (!getOtherMenu) {
      next(new appError("Other Menu not found", 400));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Menu retrieved successfully",
      data: getOtherMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateOtherMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const OtherMenuById = req.params.id;
    const { buffetName, itemName, price } = req.body;

    // validate

    const validatedData = otherMenuUpdateValidation.parse(req.body);

    const upateOtherMenu = await OtherMenu.findOneAndUpdate(
      { _id: OtherMenuById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!upateOtherMenu) {
      next(new appError("Other Menu not found", 404));
      return;
    }

    await upateOtherMenu.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Other menu updated successfully",
      data: upateOtherMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteOtherMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const OtherMenuDelete = await OtherMenu.findOneAndDelete({
      _id: req.params.id,
    });

    if (!OtherMenuDelete) {
      next(new appError("Other Menu not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Other Menu deleted successfully",
      data: OtherMenuDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
