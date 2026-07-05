import express from "express";
import {
  createEnquiry,
  deleteEnquiriesById,
  getAllEnquiry,
  getEnquiryById,
  searchEnquiry,
  updateEnquiriesById,
} from "./enquiry.controller";

const router = express.Router();

// create
router.post("/", createEnquiry);

// get all
router.get("/", getAllEnquiry);

// search (MUST COME BEFORE :id)
router.get("/search", searchEnquiry);

// get by id
router.get("/:id", getEnquiryById);

// update
router.put("/:id", updateEnquiriesById);

// delete
router.delete("/:id", deleteEnquiriesById);

export const enquiryRouter = router;
