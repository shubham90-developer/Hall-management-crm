import express from "express";
import {
  createStartersCategory,
  deleteStartersCategoryById,
  getAllStartersCategory,
  getStartersCategoryById,
  updateStartersCategoryById,
} from "./startersCategory.controller";

const router = express.Router();

// create

router.post("/", createStartersCategory);

// get all

router.get("/", getAllStartersCategory);

// get by id

router.get("/:id", getStartersCategoryById);

// update

router.put("/:id", updateStartersCategoryById);

// delete

router.delete("/:id", deleteStartersCategoryById);

export const startersCategoryRouter = router;
