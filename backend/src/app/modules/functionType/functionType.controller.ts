import { NextFunction, Request, Response } from "express";
import { FunctionType } from "./functionType.model";
import { appError } from "../../errors/appError";
import { functionTypeSchema } from "./functionType.validation";

export const createFunctionType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { functionName } = req.body;

    // check same function type
    const exixtingFunctionType = await FunctionType.findOne({
      functionName,
    });

    if (exixtingFunctionType) {
      next(new appError("Function Type already exists", 400));
      return;
    }

    // Validate the input
    const validatedData = functionTypeSchema.parse({
      functionName,
    });

    // create a function type
    const functionType = new FunctionType(validatedData);
    await functionType.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Function Type created successfully",
      data: functionType,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFunctionType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const functionTypes = await FunctionType.find().sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        functionTypes.length === 0
          ? "No Function Types found"
          : "Function Types retrieved successfully",
      data: functionTypes,
    });
  } catch (error) {
    next(error);
  }
};

export const functionTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const functionType = await FunctionType.findOne({
      _id: req.params.id,
    });

    if (!functionType) {
      next(new appError("Function Type not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Function Type retrieved successfully",
      data: functionType,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const functionTypeUpdateById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const functionTypeId = req.params.id;
    const { functionName } = req.body;

    const validateData = functionTypeSchema.parse(req.body);

    const updateFunctionType = await FunctionType.findOneAndUpdate(
      {
        _id: functionTypeId,
      },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateFunctionType) {
      next(new appError("Function Type not found", 404));
      return;
    }

    await updateFunctionType.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Function Type updated successfully",
      data: updateFunctionType,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const functionTypeDeleteById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const functionType = await FunctionType.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!functionType) {
      next(new appError("Function Type not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Function Type deleted successfully",
      data: functionType,
    });
    return;
  } catch (error) {
    next(error);
  }
};
