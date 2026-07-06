import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { OtherList } from "./otherList.model";
import {
  otherListSchema,
  otherListUpdateValidation,
} from "./otherList.validation";

export const createOtherList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { itemName, price } = req.body;

    // existing
    const existingOther = await OtherList.findOne({ itemName, price });

    if (existingOther) {
      next(new appError("other item already exist", 400));
      return;
    }

    // validation
    const validate = await otherListSchema.parse({
      itemName,
      price,
    });

    // creaate

    const createOtherList = await new OtherList(validate);

    await createOtherList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "other item list created successfully",
      data: createOtherList,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAllOtherList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const otherList = await OtherList.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Other items retrieved successfully",
      data: otherList, // returns [] when empty
    });
  } catch (error) {
    next(error);
  }
};

export const getOtherListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const otherListById = await OtherList.findOne({
      _id: req.params.id,
    });

    if (!otherListById) {
      next(new appError("other items List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "other items List retrieved successfully",
      data: otherListById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateOtherList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const otherById = req.params.id;
    // const { itemName, price } = req.body;

    const validateData = await otherListUpdateValidation.parse(req.body);

    const updateOtherList = await OtherList.findOneAndUpdate(
      {
        _id: otherById,
      },
      validateData,
      { new: true, runValidators: true },
    );

    if (!updateOtherList) {
      next(new appError("other items List not found", 404));
      return;
    }

    await updateOtherList.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "other items List updated successfully",
      data: updateOtherList,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteOtherList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const otherList = await OtherList.findOneAndDelete({
      _id: req.params.id,
    });

    if (!otherList) {
      next(new appError("other items List not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "other items List deleted successfully",
      data: otherList,
    });
    return;
  } catch (error) {
    next(error);
  }
};
