import { NextFunction, Request, Response } from "express";
import { ChatMenu } from "./chatMenu.model";
import { appError } from "../../errors/appError";
import {
  chatMenuSchema,
  chatMenuUpdateValidation,
} from "./chatMenu.validation";

export const CreateChatMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName, itemName, price } = req.body;

    // exixting

    const existingChatMenu = await ChatMenu.findOne({
      itemName,
      price,
      categoryName,
    });

    if (existingChatMenu) {
      next(new appError("Chat Menu already exists", 400));
      return;
    }

    // validate

    const validateData = chatMenuSchema.parse({
      categoryName,
      itemName,
      price,
    });

    // create

    const createChatMenu = new ChatMenu(validateData);
    await createChatMenu.save();

    res.json({
      success: true,
      statusCode: 201,
      message: "Chat Menu created successfully",
      data: createChatMenu,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllChatMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allChaatMenu = await ChatMenu.find()
      .sort({ createdAt: -1 })
      .populate("categoryName", "categoryName");

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Menu retrieved successfully",
      data: allChaatMenu,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getChatMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatMenu = await ChatMenu.findOne({ _id: req.params.id }).populate(
      "categoryName",
      "categoryName",
    );

    if (!chatMenu) {
      next(new appError("Chat Menu not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Menu retrieved successfully",
      data: chatMenu,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateChatMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatMenyById = req.params.id;
    const validateData = await chatMenuUpdateValidation.parse(req.body);

    const updateChatMenu = await ChatMenu.findOneAndUpdate(
      { _id: chatMenyById },
      validateData,
      { new: true, runValidators: true },
    );

    if (!updateChatMenu) {
      next(new appError("Chat Menu not found", 404));
      return;
    }
    await updateChatMenu.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Menu updated successfully",
      data: updateChatMenu,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteChatMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteChatMenu = await ChatMenu.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!deleteChatMenu) {
      next(new appError("chat menu not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Chat Menu deleted successfully",
      data: deleteChatMenu,
    });

    return;
  } catch (error) {
    next(error);
  }
};
