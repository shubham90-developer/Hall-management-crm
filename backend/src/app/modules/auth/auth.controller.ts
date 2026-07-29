import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "./auth.model";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import {
  RegisterValidation,
  LoginValidation,
  ChangePasswordValidation,
} from "./auth.validation";
import { IUserPayload } from "./auth.interface";

const generateToken = (
  id: string,
  username: string,
  email: string,
  role: string, // ← added
): string => {
  return jwt.sign(
    { id, username, email, role }, // ← added
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions,
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password, role } = RegisterValidation.parse(
      req.body,
    ); // ← role added

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      next(
        new appError("User with this email or username already exists", 400),
      );
      return;
    }

    const newUser = new User({ username, email, password, role }); // ← role added
    await newUser.save();

    const token = generateToken(
      newUser._id.toString(),
      newUser.username,
      newUser.email,
      newUser.role, // ← added
    );

    res.json({
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: { user: newUser, token },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = LoginValidation.parse(req.body);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      next(new appError("Invalid email or password", 401));
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      next(new appError("Invalid email or password", 401));
      return;
    }

    const token = generateToken(
      user._id.toString(),
      user.username,
      user.email,
      user.role, // ← added
    );

    const safeUser = await User.findById(user._id);

    res.json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      data: { user: safeUser, token },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById((req.user as { id: string }).id);
    if (!user) {
      next(new appError("User not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "User retrieved successfully",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, newPassword } = ChangePasswordValidation.parse(req.body);

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      next(new appError("User not found", 404));
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
      data: null,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateLogo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      next(new appError("Logo image is required", 400));
      return;
    }

    const user = await User.findByIdAndUpdate(
      (req.user as IUserPayload).id,
      { logo: req.file.path },
      { new: true },
    );

    if (!user) {
      next(new appError("User not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Logo updated successfully",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSecondaryLogo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      next(new appError("Logo image is required", 400));
      return;
    }
    const user = await User.findByIdAndUpdate(
      (req.user as IUserPayload).id,
      { secondaryLogo: req.file.path },
      { new: true },
    );
    if (!user) {
      next(new appError("User not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Secondary logo updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
