import express from "express";
import {
  createMenuList,
  deleteMenuListById,
  getAllMenuList,
  getMenuListById,
  updateMenuListById,
} from "./menuList.controller";

const router = express.Router();

// create

router.post("/", createMenuList);

// get

router.get("/", getAllMenuList);

// get by id

router.get("/:id", getMenuListById);

// update

router.put("/:id", updateMenuListById);

// delete
router.delete("/:id", deleteMenuListById);

export const menuListRouter = router;
