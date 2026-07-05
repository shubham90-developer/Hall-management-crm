import express from "express";
import {
  createTermsConditions,
  deleteTermsConditionsById,
  getAllTermsConditions,
  getTermsConditionsById,
  updateTermsConditionsById,
} from "./termsConditions.controller";

const router = express.Router();

// create
router.post("/", createTermsConditions);

// get

router.get("/", getAllTermsConditions);

// get by id

router.get("/:id", getTermsConditionsById);

// update

router.put("/:id", updateTermsConditionsById);

// delete

router.delete("/:id", deleteTermsConditionsById);

export const termsConditionsRouter = router;
