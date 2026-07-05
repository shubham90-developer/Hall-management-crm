import express from "express";
import {
  createMenucategory,
  deleteMenuCategoryById,
  getAllMenuCategory,
  getMenuCategoryById,
  updateMenuCategoryById,
} from "./menuCategory.controller";

const router = express.Router();

// create

router.post("/", createMenucategory);

// get all

router.get("/", getAllMenuCategory);

// get by id

router.get("/:id", getMenuCategoryById);

// update

router.put("/:id", updateMenuCategoryById);

// delete

router.delete("/:id", deleteMenuCategoryById);

export const menuCategoryRouter = router;
