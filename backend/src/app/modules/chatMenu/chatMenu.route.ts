import express from "express";
import {
  CreateChatMenu,
  deleteChatMenu,
  getAllChatMenu,
  getChatMenuById,
  updateChatMenu,
} from "./chatMenu.controller";

const router = express.Router();

// create

router.post("/", CreateChatMenu);

// get all

router.get("/", getAllChatMenu);

// get by id

router.get("/:id", getChatMenuById);

// update

router.put("/:id", updateChatMenu);

// delete

router.delete("/:id", deleteChatMenu);

export const chatMenuRouter = router;
