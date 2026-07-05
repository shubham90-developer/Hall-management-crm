import { NextFunction, Request, Response } from "express";
import { HallType } from "./hallType.model";
import {
  hallTypeUpdateValidation,
  hallTypeValidation,
} from "./hallType.validation";
import { appError } from "../../errors/appError";

export const createHallType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { hallName } = req.body;

    // Check if category with same title already exists
    const existingHallType = await HallType.findOne({
      hallName,
      isDeleted: false,
    });
    if (existingHallType) {
      next(new appError("Hall Type with this title already exists", 400));
      return;
    }

    // Validate the input
    const validatedData = hallTypeValidation.parse({
      hallName,
    });

    // Create a new category
    const hallType = new HallType(validatedData);
    await hallType.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Hall Type created successfully",
      data: hallType,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllHallType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hallTypes = await HallType.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        hallTypes.length === 0
          ? "No Hall Types found"
          : "Hall Types retrieved successfully",
      data: hallTypes,
    });
  } catch (error) {
    next(error);
  }
};

export const getHallTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hallType = await HallType.findOne({
      _id: req.params.id,
    });

    if (!hallType) {
      next(new appError("Hall Type not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Hall Type retrieved successfully",
      data: hallType,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateHallTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hallTypeId = req.params.id;

    const { hallName } = req.body;

    // Validate the input

    const validatedData = hallTypeUpdateValidation.parse(req.body);

    const updatedHallType = await HallType.findOneAndUpdate(
      { _id: hallTypeId },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updatedHallType) {
      next(new appError("Hall Type not found", 404));
      return;
    }

    await updatedHallType.save();

    // If no updates provided
    res.json({
      success: true,
      statusCode: 200,
      message: "Hall Type updated successfully",
      data: updatedHallType,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteHallTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hallType = await HallType.findOneAndDelete(
      { _id: req.params.id },
      { new: true },
    );

    if (!hallType) {
      next(new appError("Hall Type  not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Hall Type deleted successfully",
      data: hallType,
    });
    return;
  } catch (error) {
    next(error);
  }
};
