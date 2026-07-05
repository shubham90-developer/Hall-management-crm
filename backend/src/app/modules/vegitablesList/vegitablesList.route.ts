import express from "express";
import {
  createVegitablesList,
  deleteVegitablesList,
  getAllVegitablesList,
  getVegitablesListById,
  updateVegitablesList,
} from "./vegitablesList.controller";

const router = express.Router();

// create

router.post("/", createVegitablesList);

// get

router.get("/", getAllVegitablesList);

// get by id

router.get("/:id", getVegitablesListById);

// update

router.put("/:id", updateVegitablesList);

// delete
router.delete("/:id", deleteVegitablesList);

export const vegitablesListRouter = router;
