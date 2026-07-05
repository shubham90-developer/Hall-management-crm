import express from "express";
import {
  createSweetMenu,
  deleteSweetMenuById,
  getAllSweetMenu,
  getSweetMenuById,
  updateSweetMenuById,
} from "./sweetMenu.controller";

const router = express.Router();

// create

router.post("/", createSweetMenu);

// get all

router.get("/", getAllSweetMenu);

// get by id

router.get("/:id", getSweetMenuById);

// update

router.put("/:id", updateSweetMenuById);

// delete

router.delete("/:id", deleteSweetMenuById);

export const sweetMenuRouter = router;
