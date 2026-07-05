import { NextFunction, Request, Response } from "express";
import { CrockeryList } from "./crockeryList.model";
import { appError } from "../../errors/appError";
import {
  crockeryListSchema,
  crockeryListUpdateValidation,
} from "./crockeryList.validation";

export const createCrockeryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { crocekryName } = req.body;

    // existing
    const existingCrockery = await CrockeryList.findOne({ crocekryName });

    if (existingCrockery) {
      next(new appError("Crockery already exist", 400));
      return;
    }

    // validation
    const validate = await crockeryListSchema.parse({
      crocekryName,
    });

    // creaate

    const createCrockeryList = await new CrockeryList(validate);

    await createCrockeryList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Crockery list created successfully",
      data: createCrockeryList,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllCrockeryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const crockeryList = await CrockeryList.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Crockery List retrieved successfully",
      data: crockeryList, // returns [] when empty
    });
  } catch (error) {
    next(error);
  }
};

export const getCrockeryListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const crockeryListById = await CrockeryList.findOne({
      _id: req.params.id,
    });

    if (!crockeryListById) {
      next(new appError("Crockery List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Crockery List retrieved successfully",
      data: crockeryListById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCrockeryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const crockeryById = req.params.id;
    const { crocekryName } = req.body;

    const validateData = await crockeryListUpdateValidation.parse(req.body);

    const updateCrockeryList = await CrockeryList.findOneAndUpdate(
      {
        _id: crockeryById,
      },
      validateData,
      { new: true, runValidators: true },
    );

    if (!updateCrockeryList) {
      next(new appError("Crockery List not found", 404));
      return;
    }

    await updateCrockeryList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Crockery List updated successfully",
      data: updateCrockeryList,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteCrockeryList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const crockeryList = await CrockeryList.findOneAndDelete({
      _id: req.params.id,
    });

    if (!crockeryList) {
      next(new appError("Crockery List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Crockery List deleted successfully",
      data: crockeryList,
    });
    return;
  } catch (error) {
    next(error);
  }
};
