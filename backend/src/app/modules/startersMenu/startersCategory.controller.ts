import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { StartersMenu } from "./startersMenu.model";
import {
  startersMenuSchema,
  startersMenuUpdateValidation,
} from "./startersValidation.validation";
import { StartersCategory } from "../startersCategory/startersCategory.model";

export const createStartersMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName, itemName, price } = req.body;

    // exixting
    const existingStartersMenu = await StartersMenu.findOne({
      categoryName,
      itemName,
      price,
    });

    if (existingStartersMenu) {
      next(new appError("Starters Menu already exists", 400));
      return;
    }

    // validate

    const validateDate = startersMenuSchema.parse({
      categoryName,
      itemName,
      price,
    });

    // create

    const category = await StartersCategory.findById(categoryName);

    if (!category) {
      return next(new appError("Starters Category not found", 404));
    }

    const createStartersMenu = new StartersMenu(validateDate);
    await createStartersMenu.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Starters menu created successfully",
      data: createStartersMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllStartersMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const startersMenus = await StartersMenu.find()
      .populate("categoryName", "categoryName")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Starters Menu retrieved successfully",
      data: startersMenus,
    });
  } catch (error) {
    next(error);
  }
};

export const getStartersMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getStartersMenu = await StartersMenu.findOne({
      _id: req.params.id,
    }).populate("categoryName", "categoryName");

    if (!getStartersMenu) {
      next(new appError("Starters Menu not found", 400));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Menu retrieved successfully",
      data: getStartersMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateStartersMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const StartersMenuById = req.params.id;
    const { categoryName, itemName, price } = req.body;

    // validate

    const validatedData = startersMenuUpdateValidation.parse(req.body);

    const upateStartersMenu = await StartersMenu.findOneAndUpdate(
      { _id: StartersMenuById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!upateStartersMenu) {
      next(new appError("Starters Menu not found", 404));
      return;
    }

    await upateStartersMenu.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters menu updated successfully",
      data: upateStartersMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteStartersMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const StartersMenuDelete = await StartersMenu.findOneAndDelete({
      _id: req.params.id,
    });

    if (!StartersMenuDelete) {
      next(new appError("Starters Menu not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Menu deleted successfully",
      data: StartersMenuDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
