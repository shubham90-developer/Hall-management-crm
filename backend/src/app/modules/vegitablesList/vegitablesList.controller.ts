import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { VegitableList } from "./vegitableList.model";
import {
  vegitablesListSchema,
  vegitablesListUpdateValidation,
} from "./vegitableList.validation";

export const createVegitablesList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { vegitablesName } = req.body;

    // existing
    const existingVegitables = await VegitableList.findOne({ vegitablesName });

    if (existingVegitables) {
      next(new appError("Vegitables already exist", 400));
      return;
    }

    // validation
    const validate = await vegitablesListSchema.parse({
      vegitablesName,
    });

    // creaate

    const createVegitablesList = await new VegitableList(validate);

    await createVegitablesList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Vegitables list created successfully",
      data: createVegitablesList,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllVegitablesList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const vegitablesList = await VegitableList.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Vegitables List retrieved successfully",
      data: vegitablesList, // returns [] when empty
    });
  } catch (error) {
    next(error);
  }
};

export const getVegitablesListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const VegitablesListById = await VegitableList.findOne({
      _id: req.params.id,
    });

    if (!VegitablesListById) {
      next(new appError("Vegitables List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Vegitables List retrieved successfully",
      data: VegitablesListById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateVegitablesList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const VegitablesById = req.params.id;
    // const { VegitablesName } = req.body;

    const validateData = await vegitablesListUpdateValidation.parse(req.body);

    const updateVegitablesList = await VegitableList.findOneAndUpdate(
      {
        _id: VegitablesById,
      },
      validateData,
      { new: true, runValidators: true },
    );

    if (!updateVegitablesList) {
      next(new appError("Vegitables List not found", 404));
      return;
    }

    await updateVegitablesList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Vegitables List updated successfully",
      data: updateVegitablesList,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteVegitablesList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const vegitablesList = await VegitableList.findOneAndDelete({
      _id: req.params.id,
    });

    if (!vegitablesList) {
      next(new appError("Vegitables List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Vegitables List deleted successfully",
      data: vegitablesList,
    });
    return;
  } catch (error) {
    next(error);
  }
};
