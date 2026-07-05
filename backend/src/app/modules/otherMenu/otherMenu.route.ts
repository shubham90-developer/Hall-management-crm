import express from "express";
import {
  createOtherMenu,
  deleteOtherMenuById,
  getAllOtherMenu,
  getOtherMenuById,
  updateOtherMenuById,
} from "./otherMenu.controller";

const router = express.Router();

// create

router.post("/", createOtherMenu);

// get all

router.get("/", getAllOtherMenu);

// get by id

router.get("/:id", getOtherMenuById);

// update

router.put("/:id", updateOtherMenuById);

// delete

router.delete("/:id", deleteOtherMenuById);

export const otherMenuRouter = router;
