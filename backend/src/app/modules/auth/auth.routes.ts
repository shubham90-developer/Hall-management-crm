import { Router } from "express";
import {
  register,
  login,
  getMe,
  changePassword,
  updateLogo,
} from "./auth.controller";
import { protect } from "../../middlewares/authMiddleware";
import { upload } from "../../config/cloudinary";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/change-password", protect, changePassword);
router.patch("/logo", protect, upload.single("logo"), updateLogo);
export const authRouter = router;
