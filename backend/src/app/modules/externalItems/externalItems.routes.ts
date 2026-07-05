import express from "express";
import {
  createExternalItems,
  externalItemsById,
  externalItemsDeleteById,
  externalItemsUpdateById,
  getAllExternalItems,
} from "./externalItems.controller";

const router = express.Router();

// create

router.post("/", createExternalItems);

// get

router.get("/", getAllExternalItems);

// get by id

router.get("/:id", externalItemsById);

// update
router.put("/:id", externalItemsUpdateById);

// delete

router.delete("/:id", externalItemsDeleteById);

export const externalItemsRouter = router;
