import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getUpcomingExternalBookings,
} from "./booking.controler";

const router = Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/upcoming-external", getUpcomingExternalBookings);
router.get("/:id", getBookingById);
router.patch("/:id", updateBooking);
router.patch("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);

export const bookingRouter = router;
