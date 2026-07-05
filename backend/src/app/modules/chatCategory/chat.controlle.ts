import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { ChatCategory } from "./chat.model";
import {
  chatCategorySchema,
  chatCategoryUpdateValidation,
} from "./chat.validation";

export const createChatCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName } = req.body;

    // existing
    const existingChatCategory = await ChatCategory.findOne({
      categoryName,
    });

    if (existingChatCategory) {
      next(new appError("Chat Category already exists", 400));
      return;
    }

    // validate

    const validateDate = chatCategorySchema.parse({
      categoryName,
    });

    // create

    const createChatCategory = new ChatCategory(validateDate);
    await createChatCategory.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Chat Category created successfully",
      data: createChatCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllChatCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatCategories = await ChatCategory.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Chat Categories retrieved successfully",
      data: chatCategories,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getChatCategory = await ChatCategory.findOne({
      _id: req.params.id,
    });

    if (!getChatCategory) {
      next(new appError("Chat Category not found", 400));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Category retrieved successfully",
      data: getChatCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateChatCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ChatCategoryById = req.params.id;

    // validate

    const validatedData = chatCategoryUpdateValidation.parse(req.body);

    const updateChatCategory = await ChatCategory.findOneAndUpdate(
      { _id: ChatCategoryById },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updateChatCategory) {
      next(new appError("Chat Category not found", 404));
      return;
    }

    await updateChatCategory.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Category updated successfully",
      data: updateChatCategory,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteChatCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ChatCategoryDelete = await ChatCategory.findOneAndDelete({
      _id: req.params.id,
    });

    if (!ChatCategoryDelete) {
      next(new appError("Chat Category not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Category deleted successfully",
      data: ChatCategoryDelete,
    });

    return;
  } catch (error) {
    next(error);
  }
};
