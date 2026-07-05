import express from "express";
import {
  createChatCategory,
  deleteChatCategoryById,
  getAllChatCategory,
  getChatCategoryById,
  updateChatCategoryById,
} from "./chat.controlle";

const router = express.Router();

// create

router.post("/", createChatCategory);

// get all

router.get("/", getAllChatCategory);

// get by id

router.get("/:id", getChatCategoryById);

// update

router.put("/:id", updateChatCategoryById);

// delete

router.delete("/:id", deleteChatCategoryById);

export const chatCategoryRouter = router;
