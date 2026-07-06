import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { GrosaryList } from "./grosaryList.model";
import {
  grosaryListSchema,
  grosaryListUpdateValidation,
} from "./grosaryList.validation";

export const createGrosaryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { grosaryName } = req.body;

    // existing
    const existingGrosary = await GrosaryList.findOne({ grosaryName });

    if (existingGrosary) {
      next(new appError("grosary already exist", 400));
      return;
    }

    // validation
    const validate = await grosaryListSchema.parse({
      grosaryName,
    });

    // creaate

    const createGrosaryList = await new GrosaryList(validate);

    await createGrosaryList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "grosary list created successfully",
      data: createGrosaryList,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllGrosaryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const grosaryList = await GrosaryList.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Grocery List retrieved successfully",
      data: grosaryList, // returns [] when empty
    });
  } catch (error) {
    next(error);
  }
};

export const getGrosaryListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const grosaryListById = await GrosaryList.findOne({
      _id: req.params.id,
    });

    if (!grosaryListById) {
      next(new appError("grosary List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Grosary List retrieved successfully",
      data: grosaryListById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateGrosaryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const grosaryById = req.params.id;
    // const { grosaryName } = req.body;

    const validateData = await grosaryListUpdateValidation.parse(req.body);

    const updateGrosaryList = await GrosaryList.findOneAndUpdate(
      {
        _id: grosaryById,
      },
      validateData,
      { new: true, runValidators: true },
    );

    if (!updateGrosaryList) {
      next(new appError("grosary List not found", 404));
      return;
    }

    await updateGrosaryList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Grosary List updated successfully",
      data: updateGrosaryList,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteGrosaryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const grosaryList = await GrosaryList.findOneAndDelete({
      _id: req.params.id,
    });

    if (!grosaryList) {
      next(new appError("grosary List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Grosary List deleted successfully",
      data: grosaryList,
    });
    return;
  } catch (error) {
    next(error);
  }
};
