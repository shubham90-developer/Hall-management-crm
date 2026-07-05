import express from "express";
import {
  createGrosaryList,
  deleteGrosaryList,
  getAllGrosaryList,
  getGrosaryListById,
  updateGrosaryList,
} from "./grosaryList.controller";

const router = express.Router();

// create

router.post("/", createGrosaryList);

// get

router.get("/", getAllGrosaryList);

// get by id

router.get("/:id", getGrosaryListById);

// update

router.put("/:id", updateGrosaryList);

// delete
router.delete("/:id", deleteGrosaryList);

export const grosaryListRouter = router;
