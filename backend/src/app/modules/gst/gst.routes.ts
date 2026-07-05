import express from "express";
import { getGst, updateGst } from "./gst.controller";

const router = express.Router();

router.get("/", getGst);
router.patch("/", updateGst);

export const gstRouter = router;
