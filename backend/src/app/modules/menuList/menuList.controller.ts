import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";

import { BuffetName } from "../buffetName/buffetName.model";
import { MenuList } from "./menuList.model";
import { menuListUpdateValidation } from "./menuList.validation";
import { MenuCategory } from "../menuCategory/menuCategory.model";
import { CrockeryList } from "../crockeryList/crockeryList.model";
import { GrosaryList } from "../grosaryList/grosaryList.model";

export const createMenuList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      buffetName,
      categoryName,
      itemName,
      crocekryName,
      qty,
      grosaryName,
    } = req.body;

    // check duplicate
    const existingMenuList = await MenuList.findOne({
      buffetName,
      categoryName,
      itemName,
      crocekryName,
      qty,
      grosaryName,
    });

    if (existingMenuList) {
      return next(new appError("Menu list already exists", 400));
    }

    // validate
    const validatedData = menuListUpdateValidation.parse(req.body);

    // check references
    const [bName, cName, crockeryChecks, grosaryChecks] = await Promise.all([
      BuffetName.findById(buffetName),
      MenuCategory.findById(categoryName),
      Promise.all(
        (crocekryName || []).map((c: any) => CrockeryList.findById(c.item)),
      ),
      Promise.all(
        (grosaryName || []).map((g: any) => GrosaryList.findById(g.item)),
      ),
    ]);

    if (
      !bName ||
      !cName ||
      crockeryChecks.some((c) => !c) ||
      grosaryChecks.some((g) => !g)
    ) {
      return next(
        new appError("Buffet, category, crockery or grocery not found", 400),
      );
    }

    const created = await MenuList.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Menu list created successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMenuList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menuList = await MenuList.find()
      .populate("buffetName")
      .populate("categoryName")
      .populate("crocekryName.item")
      .populate("grosaryName.item")
      .populate("vegitablesName.item")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        menuList.length > 0
          ? "Menu list retrieved successfully"
          : "No menu list found",
      data: menuList,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await MenuList.findById(req.params.id)
      .populate("buffetName")
      .populate("categoryName")
      .populate("crocekryName.item")
      .populate("grosaryName.item")
      .populate("vegitablesName.item");

    if (!menu) {
      return next(new appError("Menu list not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu list retrieved successfully",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = menuListUpdateValidation.parse(req.body);

    const updated = await MenuList.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updated) {
      return next(new appError("Menu list not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu list updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuListById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleted = await MenuList.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new appError("Menu list not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Menu list deleted successfully",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};
