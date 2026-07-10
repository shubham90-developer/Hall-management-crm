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
    const allBookings = await Booking.find({})
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
      .sort({ createdAt: 1 });

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

      // Menu pricing — completely unchanged
      const { subtotalamount, grandTotal, finalAmount, pendingAmount } =
        calculatePricing(
          totalAmount,
          additionalAmount,
          specialMenuAmount,

          gst,
          discount,
          advance,
        );

      // Hall pricing — separate track, independent of menu totals above
      const isNB = existingBooking.status === "NB";
      const hallAmount = Number(
        parsedPricing.hallAmount ?? existingBooking.hallAmount ?? 0,
      );
      const cgst = isNB ? 0 : Number(parsedPricing.cgst ?? 0);
      const sgst = isNB ? 0 : Number(parsedPricing.sgst ?? 0);
      const hallFinalAmount = hallAmount + cgst + sgst;

      validateData = {
        ...parsedPricing,
        subtotalamount,
        grandTotal,
        finalAmount,
        pendingAmount,
        hallAmount,
        cgst,
        sgst,
        hallFinalAmount,
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

export const getDayRequirements = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { functionDate } = req.query;
    if (!functionDate) {
      return next(new appError("functionDate is required", 400));
    }

    const start = new Date(functionDate as string);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // 1. Get all bookings on this functionDate
    const bookings = await Booking.find({
      functionDate: { $gte: start, $lt: end },
      status: { $ne: "Cancelled" },
    }).populate({
      path: "menu",
      populate: [
        { path: "crocekryName.item", model: "CrockeryList" },
        { path: "grosaryName.item", model: "GrosaryList" },
        { path: "vegitablesName.item", model: "VegitableList" },
      ],
    });

    const grosaryMap: Record<
      string,
      { name: string; qty: number; unit: string }
    > = {};
    const crockeryMap: Record<
      string,
      { name: string; qty: number; unit: string }
    > = {};
    const vegMap: Record<string, { name: string; qty: number; unit: string }> =
      {};

    // "50kg" -> 50, "200pcs" -> 200, "" -> 0
    const parseQtyNumber = (val: string) => {
      const match = String(val ?? "").match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    };

    // "50kg" -> "kg", "200 pcs" -> "pcs"
    const parseUnit = (val: string) => {
      const match = String(val ?? "").match(/[a-zA-Z]+/);
      return match ? match[0] : "";
    };

    // Maps every unit variant to one canonical "base unit" per measurement family,
    // so quantities in different units (kg vs g, l vs ml) can be summed correctly.
    const UNIT_CONVERSIONS: Record<string, { base: string; factor: number }> = {
      kg: { base: "g", factor: 1000 },
      g: { base: "g", factor: 1 },
      l: { base: "ml", factor: 1000 },
      ml: { base: "ml", factor: 1 },
      pcs: { base: "pcs", factor: 1 },
    };

    // Converts a parsed qty+unit pair into its base-unit equivalent.
    // Unknown units (not in the table) are passed through unchanged as a safe fallback.
    const toBaseUnit = (qty: number, unit: string) => {
      const conv = UNIT_CONVERSIONS[unit.toLowerCase()];
      if (!conv) return { baseQty: qty, baseUnit: unit };
      return { baseQty: qty * conv.factor, baseUnit: conv.base };
    };

    // Guest-scaled add: same formula as the per-booking requirement sheets —
    // rate = (item qty ÷ menu item's base guest count), required = rate × actual guests.
    // Result is then normalized into a base unit before being summed into the map,
    // so mixed units (e.g. "20kg" and "500g") for the same item combine correctly.
    const addToMap = (
      map: any,
      name: string,
      qtyStr: string,
      menuBaseGuests: number,
      guests: number,
    ) => {
      if (!name) return;
      const entryQty = parseQtyNumber(qtyStr);
      const unit = parseUnit(qtyStr);
      const rate = menuBaseGuests > 0 ? entryQty / menuBaseGuests : 0;
      const required = Number((rate * guests).toFixed(2));

      const { baseQty: normQty, baseUnit } = toBaseUnit(required, unit);
      const key = `${name}__${baseUnit}`;

      if (!map[key]) map[key] = { name, qty: 0, unit: baseUnit };
      map[key].qty += normQty;
    };

    for (const booking of bookings as any[]) {
      const guests = Number(booking.guests) || 0;

      for (const menuItem of booking.menu || []) {
        const baseQty = Number(menuItem.qty) || 0;

        (menuItem.crocekryName || []).forEach((c: any) =>
          addToMap(crockeryMap, c.item?.crocekryName, c.qty, baseQty, guests),
        );
        (menuItem.grosaryName || []).forEach((g: any) =>
          addToMap(grosaryMap, g.item?.grosaryName, g.qty, baseQty, guests),
        );
        (menuItem.vegitablesName || []).forEach((v: any) =>
          addToMap(vegMap, v.item?.vegitablesName, v.qty, baseQty, guests),
        );
      }
    }

    // Converts large base-unit values back into a friendlier display unit
    // e.g. 5000g -> 5kg, 2500ml -> 2.5l. Leaves pcs and anything else as-is.
    const formatForDisplay = (item: {
      name: string;
      qty: number;
      unit: string;
    }) => {
      if (item.unit === "g" && item.qty >= 1000) {
        return {
          name: item.name,
          qty: Number((item.qty / 1000).toFixed(2)),
          unit: "kg",
        };
      }
      if (item.unit === "ml" && item.qty >= 1000) {
        return {
          name: item.name,
          qty: Number((item.qty / 1000).toFixed(2)),
          unit: "l",
        };
      }
      return {
        name: item.name,
        qty: Number(item.qty.toFixed(2)),
        unit: item.unit,
      };
    };

    res.json({
      success: true,
      statusCode: 200,
      message: "Day requirements calculated successfully",
      data: {
        functionDate: start,
        bookingsCount: bookings.length,
        crockery: Object.values(crockeryMap)
          .map(formatForDisplay)
          .sort((a, b) => a.name.localeCompare(b.name)),
        grocery: Object.values(grosaryMap)
          .map(formatForDisplay)
          .sort((a, b) => a.name.localeCompare(b.name)),
        vegetables: Object.values(vegMap)
          .map(formatForDisplay)
          .sort((a, b) => a.name.localeCompare(b.name)),
      },
    });
  } catch (error) {
    next(error);
  }
};
