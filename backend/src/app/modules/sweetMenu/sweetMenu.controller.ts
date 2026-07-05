import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { SweetMenu } from "./sweetMenu.model";
import {
  sweetMenuSchema,
  sweetMenuUpdateValidation,
} from "./sweetMenu.validation";
import { BuffetName } from "../buffetName/buffetName.model";

export const createSweetMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { buffetName, itemName, price } = req.body;

    // exixting
    const existingSweetMenu = await SweetMenu.findOne({
      buffetName,
      itemName,
      price,
    });

    if (existingSweetMenu) {
      next(new appError("Sweet Menu already exists", 400));
      return;
    }

    // validate

    const validateDate = sweetMenuSchema.parse({
      buffetName,
      itemName,
      price,
    });

    // create

    const name = await BuffetName.findById(buffetName);

    if (!name) {
      return next(new appError("Buffet Name not found", 404));
    }

    const createSweetMenu = new SweetMenu(validateDate);
    await createSweetMenu.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Sweet menu created successfully",
      data: createSweetMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllSweetMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sweetMenu = await SweetMenu.find()
      .populate("buffetName", "buffetName")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sweet Menu retrieved successfully",
      data: sweetMenu,
    });
  } catch (error) {
    next(error);
  }
};

export const getSweetMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getSweetMenu = await SweetMenu.findOne({
      _id: req.params.id,
    }).populate("buffetName", "buffetName");

    if (!getSweetMenu) {
      next(new appError("sweet Menu not found", 400));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Menu retrieved successfully",
      data: getSweetMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateSweetMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SweetMenuById = req.params.id;
    // const { buffetName, itemName, price } = req.body;

    // validate

    const validatedData = sweetMenuUpdateValidation.parse(req.body);

    const upateSweetMenu = await SweetMenu.findOneAndUpdate(
      { _id: SweetMenuById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!upateSweetMenu) {
      next(new appError("sweet Menu not found", 404));
      return;
    }

    await upateSweetMenu.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "sweet menu updated successfully",
      data: upateSweetMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteSweetMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SweetMenuDelete = await SweetMenu.findOneAndDelete({
      _id: req.params.id,
    });

    if (!SweetMenuDelete) {
      next(new appError("sweet Menu not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "sweet Menu deleted successfully",
      data: SweetMenuDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
