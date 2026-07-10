import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createMenuList,
  deleteMenuListById,
  getAllMenuList,
  getMenuListById,
  updateMenuListById,
} from "./menuList.controller";

const router = express.Router();

router.post("/", upload.single("menuImage"), createMenuList);

// get
router.get("/", getAllMenuList);

// get by id
router.get("/:id", getMenuListById);

// update (multipart/form-data, image file field name: "menuImage")
router.put("/:id", upload.single("menuImage"), updateMenuListById);

// delete
router.delete("/:id", deleteMenuListById);

export const menuListRouter = router;
