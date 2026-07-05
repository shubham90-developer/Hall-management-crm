import { NextFunction, Request, Response } from "express";
import { BuffetName } from "./buffetName.model";
import { appError } from "../../errors/appError";
import {
  buffetNameSchema,
  buffetNameUpdateValidation,
} from "./buffetName.validation";

export const createBuffetName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { buffetName } = req.body;

    const existingBuffetName = await BuffetName.findOne({
      buffetName,
    });

    if (existingBuffetName) {
      next(new appError("Buffet Name already exists", 400));
      return;
    }

    // validate

    const validatedData = buffetNameSchema.parse({
      buffetName,
    });

    // create buffet name

    const newbBuffetName = new BuffetName(validatedData);
    await newbBuffetName.save();

    res.json({
      success: true,
      statusCode: 201,
      message: "Buffet Name created successfully",
      data: newbBuffetName,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBuffetNames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buffetNames = await BuffetName.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        buffetNames.length === 0
          ? "No Buffet Names found"
          : "Buffet Names retrieved successfully",
      data: buffetNames,
    });
  } catch (error) {
    next(error);
  }
};

export const getBuffetNameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buffetName = await BuffetName.findOne({
      _id: req.params.id,
    });

    if (!buffetName) {
      next(new appError("Buffet Name not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Buffet Name retrieved successfully",
      data: buffetName,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateBuffetNameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buffetNameId = req.params.id;

    const { buffetName } = req.body;
    const validatedData = buffetNameUpdateValidation.parse(req.body);

    const updateBuffetName = await BuffetName.findOneAndUpdate(
      { _id: buffetNameId },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updateBuffetName) {
      next(new appError("Buffet Name not found", 404));
      return;
    }

    await updateBuffetName.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Buffet Name updated successfully",
      data: updateBuffetName,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteBuffetNameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buffetName = await BuffetName.findOneAndDelete(
      { _id: req.params.id },
      { new: true },
    );

    if (!buffetName) {
      next(new appError("Buffet Name not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Buffet Name deleted successfully",
      data: buffetName,
    });

    return;
  } catch (error) {
    next(error);
  }
};
