import express from "express";
import {
  createBuffetName,
  deleteBuffetNameById,
  getAllBuffetNames,
  getBuffetNameById,
  updateBuffetNameById,
} from "./buffetName.controller";

const router = express.Router();

// create

router.post("/", createBuffetName);

// get all

router.get("/", getAllBuffetNames);

// get one

router.get("/:id", getBuffetNameById);

// update

router.put("/:id", updateBuffetNameById);

// delete
router.delete("/:id", deleteBuffetNameById);

export const buffetNameRouter = router;
