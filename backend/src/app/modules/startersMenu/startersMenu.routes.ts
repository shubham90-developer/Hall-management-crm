import express from "express";
import {
  createStartersMenu,
  deleteStartersMenuById,
  getAllStartersMenu,
  getStartersMenuById,
  updateStartersMenuById,
} from "./startersCategory.controller";

const router = express.Router();

// create

router.post("/", createStartersMenu);

// get all

router.get("/", getAllStartersMenu);

// get by id

router.get("/:id", getStartersMenuById);

// update

router.put("/:id", updateStartersMenuById);

// delete

router.delete("/:id", deleteStartersMenuById);

export const startersMenuRouter = router;
