import { Router } from "express";
import {
  register,
  login,
  getMe,
  changePassword,
  updateLogo,
  updateSecondaryLogo,
} from "./auth.controller";

import { protect } from "../../middlewares/authMiddleware";
import { upload } from "../../config/cloudinary";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/change-password", protect, changePassword);
router.patch("/logo", protect, upload.single("logo"), updateLogo);
router.patch(
  "/secondary-logo",
  protect,
  upload.single("logo"),
  updateSecondaryLogo,
);
export const authRouter = router;
