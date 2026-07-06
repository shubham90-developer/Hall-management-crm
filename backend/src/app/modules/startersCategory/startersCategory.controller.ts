import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { StartersCategory } from "./startersCategory.model";
import {
  startersCategorySchema,
  startersCategoryUpdateValidation,
} from "./startersCategory.validation";

export const createStartersCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName } = req.body;

    // exixting
    const existingStartersCategory = await StartersCategory.findOne({
      categoryName,
    });

    if (existingStartersCategory) {
      next(new appError("Starters Category already exists", 400));
      return;
    }

    // validate

    const validateDate = startersCategorySchema.parse({
      categoryName,
    });

    // create

    const createStartersCategory = new StartersCategory(validateDate);
    await createStartersCategory.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Starters Category created successfully",
      data: createStartersCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllStartersCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const startersCategories = await StartersCategory.find().sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Starters Categories retrieved successfully",
      data: startersCategories,
    });
  } catch (error) {
    next(error);
  }
};

export const getStartersCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getStartersCategory = await StartersCategory.findOne({
      _id: req.params.id,
    });

    if (!getStartersCategory) {
      next(new appError("Starters Category not found", 400));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Category retrieved successfully",
      data: getStartersCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateStartersCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const StartersCategoryById = req.params.id;
    const { categoryName } = req.body;

    // validate

    const validatedData = startersCategoryUpdateValidation.parse(req.body);

    const upateStartersCategory = await StartersCategory.findOneAndUpdate(
      { _id: StartersCategoryById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!upateStartersCategory) {
      next(new appError("Starters Category not found", 404));
      return;
    }

    await upateStartersCategory.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Category updated successfully",
      data: upateStartersCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteStartersCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const StartersCategoryDelete = await StartersCategory.findOneAndDelete({
      _id: req.params.id,
    });

    if (!StartersCategoryDelete) {
      next(new appError("Starters Category not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Starters Category deleted successfully",
      data: StartersCategoryDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
