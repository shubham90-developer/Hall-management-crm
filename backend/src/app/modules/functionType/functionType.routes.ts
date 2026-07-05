import express from "express";
import {
  createFunctionType,
  functionTypeById,
  functionTypeDeleteById,
  functionTypeUpdateById,
  getAllFunctionType,
} from "./functionType.controller";

const router = express.Router();

// create

router.post("/", createFunctionType);

// get

router.get("/", getAllFunctionType);

// get by id

router.get("/:id", functionTypeById);

// update
router.put("/:id", functionTypeUpdateById);

// delete

router.delete("/:id", functionTypeDeleteById);

export const functionTypeRouter = router;
