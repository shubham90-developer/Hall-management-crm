import { NextFunction, Request, Response } from "express";
import Booking from "./booking.model";
import { appError } from "../../errors/appError";
import {
  BasicBookingValidation,
  BasicBookingUpdateValidation,
  MenuBookingValidation,
  PricingBookingValidation,
} from "./booking.validation";
import { HallType } from "../hallType/hallType.model";
import { Counter } from "./booking.model";

const NOTIFY_ITEMS = ["ढोकळा", "सुरळीवाडी", "मोदक", "मसाला पान"];

const checkHallConflict = async (
  hall: string,
  bookingDate: Date,
  startTime: number,
  endTime: number,
  excludeBookingId?: string,
) => {
  const hallData = await HallType.findById(hall);
  if (!hallData) throw new appError("Hall not found", 404);

  const baseQuery: any = {
    bookingDate,
    status: { $ne: "Cancelled" },
    ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
  };
  if (hallData.hallName === "Full Hall") {
    const anyBooking = await Booking.findOne(baseQuery);
    if (anyBooking)
      throw new appError(
        "Full Hall cannot be booked as another booking exists on this date",
        400,
      );
  }

  const fullHall = await HallType.findOne({ hallName: "Full Hall" });
  if (fullHall) {
    const fullHallBooked = await Booking.findOne({
      ...baseQuery,
      hall: fullHall._id,
    });
    if (fullHallBooked)
      throw new appError(
        "No hall can be booked as Full Hall is already booked on this date",
        400,
      );
  }

  const sameHallBooked = await Booking.findOne({
    ...baseQuery,
    hall,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });
  if (sameHallBooked)
    throw new appError(
      "This hall is already booked for selected date and time slot",
      400,
    );

  return hallData;
};

const calculatePricing = (
  totalAmount: number,
  additionalAmount: number,
  specialMenuAmount: number,
  gst: number,

  discount: number,
  advance: number,
) => {
  const subtotalamount = totalAmount + additionalAmount + specialMenuAmount;
  const grandTotal = subtotalamount + gst;
  const finalAmount = grandTotal - discount;
  const pendingAmount = finalAmount - advance;

  return { subtotalamount, grandTotal, finalAmount, pendingAmount };
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { hall, bookingDate, startTime, endTime, ...rest } =
      BasicBookingValidation.parse(req.body);

    await checkHallConflict(hall, bookingDate, startTime, endTime);

    const counter = await Counter.findOneAndUpdate(
      { name: "booking" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    const bookingNo = `B${String(counter!.seq).padStart(4, "0")}`;

    const newBooking = new Booking({
      hall,
      bookingDate,
      startTime,
      endTime,
      bookingNo,
      ...rest,
    });
    await newBooking.save();

    res.json({
      success: true,
      statusCode: 201,
      message: "Booking created successfully",
      data: newBooking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allBookings = await Booking.find({ status: { $ne: "Cancelled" } })
      .populate({
        path: "enquiry",
        populate: { path: "functionName", model: "FunctionType" },
      })
      .populate("functionType")
      .populate("hall")
      .populate({
        path: "menu",
        populate: [
          { path: "crocekryName.item", model: "CrockeryList" },
          { path: "grosaryName.item", model: "GrosaryList" },
          { path: "vegitablesName.item", model: "VegitableList" },
        ],
      })
      .populate({
        path: "sweets",
        populate: { path: "buffetName", model: "BuffetName" },
      })
      .populate({
        path: "additional",
        populate: { path: "buffetName", model: "BuffetName" },
      })
      .populate("starters")
      .populate("chatMenu")
      .populate({ path: "other.id", model: "OtherList" })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: "Bookings retrieved successfully",
      data: allBookings,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await Booking.findById(req.params.id as string)
      .populate({
        path: "enquiry",
        populate: { path: "functionName", model: "FunctionType" },
      })
      .populate("functionType")
      .populate("hall")
      .populate({
        path: "menu",
        populate: [
          { path: "buffetName", model: "BuffetName" },
          { path: "categoryName", model: "MenuCategory" },
          { path: "crocekryName.item", model: "CrockeryList" },
          { path: "grosaryName.item", model: "GrosaryList" },
          { path: "vegitablesName.item", model: "VegitableList" },
        ],
      })
      .populate({
        path: "sweets",
        populate: { path: "buffetName", model: "BuffetName" },
      })
      .populate({
        path: "additional",
        populate: { path: "buffetName", model: "BuffetName" },
      })
      .populate("starters")
      .populate("chatMenu")
      .populate({ path: "other.id", model: "OtherList" });

    if (!booking) {
      next(new appError("Booking not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Booking retrieved successfully",
      data: booking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = req.params.id as string;
    const step = req.query.step as string;

    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      next(new appError("Booking not found", 404));
      return;
    }

    let validateData: any;

    if (step === "basic") {
      validateData = BasicBookingUpdateValidation.parse(req.body);

      const hall = validateData.hall ?? existingBooking.hall.toString();
      const bookingDate =
        validateData.bookingDate ?? existingBooking.bookingDate;
      const startTime = validateData.startTime ?? existingBooking.startTime;
      const endTime = validateData.endTime ?? existingBooking.endTime;

      await checkHallConflict(hall, bookingDate, startTime, endTime, bookingId);
    } else if (step === "menu") {
      validateData = MenuBookingValidation.partial().parse(req.body);
    } else if (step === "pricing") {
      const parsedPricing = PricingBookingValidation.partial().parse(req.body);

      const {
        totalAmount = 0,
        additionalAmount = 0,
        specialMenuAmount = 0,
        gst = 0,

        discount = 0,
      } = parsedPricing;

      const advance = Number(existingBooking.advance || 0);

      const { subtotalamount, grandTotal, finalAmount, pendingAmount } =
        calculatePricing(
          totalAmount,
          additionalAmount,
          specialMenuAmount,

          gst,
          discount,
          advance,
        );

      validateData = {
        ...parsedPricing,
        subtotalamount,
        grandTotal,
        finalAmount,
        pendingAmount,
      };
    } else {
      next(new appError("Invalid step. Use: basic | menu | pricing", 400));
      return;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: validateData },
      { new: true, runValidators: true },
    )
      .populate({
        path: "enquiry",
        populate: { path: "functionName", model: "FunctionType" },
      })
      .populate("functionType")
      .populate("hall")
      .populate({
        path: "menu",
        populate: [
          { path: "buffetName", model: "BuffetName" },
          { path: "categoryName", model: "MenuCategory" },
          { path: "crocekryName.item", model: "CrockeryList" },
          { path: "grosaryName.item", model: "GrosaryList" },
          { path: "vegitablesName.item", model: "VegitableList" },
        ],
      })
      .populate({
        path: "sweets",
        populate: { path: "buffetName", model: "BuffetName" },
      })
      .populate({
        path: "additional",
        populate: { path: "buffetName", model: "BuffetName" },
      })
      .populate({ path: "other.id", model: "OtherList" });

    res.json({
      success: true,
      statusCode: 200,
      message: `Booking ${step} info updated successfully`,
      data: updatedBooking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await Booking.findById(req.params.id as string);
    if (!booking) {
      next(new appError("Booking not found", 404));
      return;
    }

    if (booking.status === "Cancelled") {
      next(new appError("Booking is already cancelled", 400));
      return;
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Booking cancelled successfully",
      data: booking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(
      req.params.id as string,
    );
    if (!deletedBooking) {
      next(new appError("Booking not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Booking deleted successfully",
      data: deletedBooking,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getUpcomingExternalBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      bookingDate: { $gte: now, $lte: threeDaysLater },
      status: { $ne: "Cancelled" },
    })
      .populate("enquiry")
      .populate("menu", "itemName")
      .populate("sweets", "itemName")
      .populate("additional", "itemName")
      .sort({ bookingDate: 1 });

    const matchedBookings = bookings
      .map((booking) => {
        const allItems = [
          ...(booking.menu as any[]),
          ...(booking.sweets as any[]),
          ...(booking.additional as any[]),
        ];

        const matchedItems = allItems
          .map((item) => item?.itemName?.trim())
          .filter((name) => name && NOTIFY_ITEMS.includes(name));

        return matchedItems.length > 0
          ? { ...booking.toObject(), matchedItems }
          : null;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        matchedBookings.length === 0
          ? "No upcoming bookings with selected special items"
          : "Upcoming bookings retrieved successfully",
      data: matchedBookings,
    });
  } catch (error) {
    next(error);
  }
};
