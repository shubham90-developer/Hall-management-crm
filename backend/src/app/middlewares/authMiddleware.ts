import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appError } from "../errors/appError";
import { IUserPayload } from "../modules/auth/auth.interface";
declare module "express-serve-static-core" {
  interface Request {
    user?: IUserPayload;
  }
}

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new appError("No token provided, authorization denied", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IUserPayload;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new appError("Invalid or expired token", 401));
      return;
    }
    next(error);
  }
};
