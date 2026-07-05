import { NextFunction, Request, Response } from "express";
import { MenuCategory } from "./menuCategory.model";
import { appError } from "../../errors/appError";
import {
  menuCategorySchema,
  menuCategoryUpdateValidation,
} from "./menuCategory.validation";

export const createMenucategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName } = req.body;

    // exixting
    const existingCategoryMenu = await MenuCategory.findOne({
      categoryName,
    });

    if (existingCategoryMenu) {
      next(new appError("Menu Category already exists", 400));
      return;
    }

    // validate

    const validateDate = menuCategorySchema.parse({
      categoryName,
    });

    // create

    const createMenuCategory = new MenuCategory(validateDate);
    await createMenuCategory.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Menu Category created successfully",
      data: createMenuCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllMenuCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menuCategory = await MenuCategory.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        menuCategory.length === 0
          ? "No Menu Categories found"
          : "Menu Category retrieved successfully",
      data: menuCategory, // always array
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menuCategory = await MenuCategory.findOne({
      _id: req.params.id,
    });

    if (!menuCategory) {
      next(new appError("Menu Category not found", 400));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu Category retrieved successfully",
      data: menuCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateMenuCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menuCategoryById = req.params.id;
    const { categoryName } = req.body;

    // validate

    const validatedData = menuCategoryUpdateValidation.parse(req.body);

    const upateMenuCategory = await MenuCategory.findOneAndUpdate(
      { _id: menuCategoryById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!upateMenuCategory) {
      next(new appError("Menu Category not found", 404));
      return;
    }

    await upateMenuCategory.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu Category updated successfully",
      data: upateMenuCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteMenuCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menuCategoryDelete = await MenuCategory.findOneAndDelete({
      _id: req.params.id,
    });

    if (!menuCategoryDelete) {
      next(new appError("Menu Category not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu Category deleted successfully",
      data: menuCategoryDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
