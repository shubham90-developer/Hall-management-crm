import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { ExternalItems } from "./externalItems.model";
import {
  externalItemsSchema,
  externalItemsUpdateValidation,
} from "./externalItems.validation";

export const createExternalItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { itemName, buffet, status } = req.body;

    // check same function type
    const exixtingExternalItems = await ExternalItems.findOne({
      itemName,
    });

    if (exixtingExternalItems) {
      next(new appError("Items Type already exists", 400));
      return;
    }

    const validatedData = externalItemsSchema.parse({
      itemName,
      buffet,
      status,
    });
    // create a function type
    const externalItems = new ExternalItems(validatedData);
    await externalItems.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Items Type created successfully",
      data: externalItems,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllExternalItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const externalItems = await ExternalItems.find().populate("buffet").sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        externalItems.length === 0
          ? "No Items Types found"
          : "Items retrieved successfully",
      data: externalItems,
    });
  } catch (error) {
    next(error);
  }
};

export const externalItemsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const externalItems = await ExternalItems.findOne({
      _id: req.params.id,
    });

    if (!externalItems) {
      next(new appError("items Type not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "items Type retrieved successfully",
      data: externalItems,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const externalItemsUpdateById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const externalItemsId = req.params.id;
    // const { functionName } = req.body;

    const validateData = externalItemsUpdateValidation.parse(req.body);

    const updateExternalItems = await ExternalItems.findOneAndUpdate(
      {
        _id: externalItemsId,
      },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateExternalItems) {
      next(new appError("items Type not found", 404));
      return;
    }

    await updateExternalItems.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "items Type updated successfully",
      data: updateExternalItems,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const externalItemsDeleteById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const externalItems = await ExternalItems.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!externalItems) {
      next(new appError("items Type not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "items Type deleted successfully",
      data: externalItems,
    });
    return;
  } catch (error) {
    next(error);
  }
};
