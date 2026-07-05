import express from "express";
import { upload } from "../../config/cloudinary";

import {
  uploadSingleImage,
  uploadMultipleImages,
  uploadKYCDocument,
  deleteUploadedFile,
} from "./upload.controller";

const router = express.Router();

// Upload a single image (requires authentication)
router.post("/single", upload.single("image"), uploadSingleImage);

// Upload multiple images (requires authentication)
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);

// Upload KYC document (public route for KYC form)
router.post("/kyc-document", upload.single("document"), uploadKYCDocument);

router.delete("/delete/:publicId", deleteUploadedFile);

export const uploadRouter = router;
