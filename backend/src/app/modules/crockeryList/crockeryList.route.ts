import express from "express";
import {
  createCrockeryList,
  deleteCrockeryList,
  getAllCrockeryList,
  getCrockeryListById,
  updateCrockeryList,
} from "./crockeryList.controller";

const router = express.Router();

// create

router.post("/", createCrockeryList);

// get

router.get("/", getAllCrockeryList);

// get by id

router.get("/:id", getCrockeryListById);

// update

router.put("/:id", updateCrockeryList);

// delete
router.delete("/:id", deleteCrockeryList);

export const crockeryListRouter = router;
