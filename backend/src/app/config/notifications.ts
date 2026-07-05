import cron from "node-cron";
import Booking from "../modules/bookings/booking.model";

export const startNotificationCron = () => {
  // runs every 12 hours at 00:00 and 12:00
  cron.schedule("0 0,12 * * *", async () => {
    try {
      const now = new Date();
      const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      const bookings = await Booking.find({
        externalItems: { $exists: true, $not: { $size: 0 } },
        bookingDate: { $gte: now, $lte: threeDaysLater },
      })
        .populate("enquiry")
        .populate("externalItems");

      if (bookings.length === 0) {
        console.log("[CRON] No upcoming bookings with external items");
        return;
      }

      console.log(
        `[CRON] ${bookings.length} booking(s) with external items approaching:`,
      );

      for (const booking of bookings) {
        console.log(
          `  → Booking ID: ${booking._id} | Date: ${booking.bookingDate}`,
        );
        // plug in your email/SMS/push notification here
      }
    } catch (error) {
      console.error("[CRON] Notification cron error:", error);
    }
  });

  console.log("[CRON] Notification cron started");
};
