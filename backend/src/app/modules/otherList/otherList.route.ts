import express from "express";
import {
  createOtherList,
  deleteOtherList,
  getAllOtherList,
  getOtherListById,
  updateOtherList,
} from "./otherList.controller";

const router = express.Router();

// create

router.post("/", createOtherList);

// get

router.get("/", getAllOtherList);

// get by id

router.get("/:id", getOtherListById);

// update

router.put("/:id", updateOtherList);

// delete
router.delete("/:id", deleteOtherList);

export const otherListRouter = router;
