import { z } from "zod";

const objectId = (field: string) =>
  z
    .string(`${field} is required`)
    .regex(/^[a-fA-F0-9]{24}$/, `Invalid ${field} ID`);

const timeToMinutes = z.union([
  z.number(),
  z
    .string()
    .min(1)
    .transform((val) => {
      const parts = val.trim().split(" ");
      const timePart = parts[0];
      const meridiem = parts[1]?.toUpperCase();

      let [hours, minutes] = timePart.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time format. Use HH:MM or HH:MM AM/PM");
      }

      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }),
]);

// ── Step 1: Basic Booking ─────────────────────────────────────────────────────
export const BasicBookingValidation = z.object({
  enquiry: objectId("Enquiry"),
  address: z.string("Address is required").min(1, "Address cannot be empty"),
  gstNo: z.string().optional().nullable(),
  bookingDate: z
    .string("Booking Date is required")
    .or(z.date())
    .transform((val) => new Date(val)),
  functionDate: z.coerce.date(),
  functionType: objectId("Function Type"),
  hall: objectId("Hall"),
  startTime: timeToMinutes,
  endTime: timeToMinutes,
  advance: z.number().min(0, "Advance cannot be negative").default(0),
  paymentMethod: z.string("Payment Method is required").min(1),
  status: z
    .enum(["Confirmed", "Pencil", "Cancelled", "NB"])
    .default("Confirmed"),
});

// ── Step 2: Menu Booking ──────────────────────────────────────────────────────
export const MenuBookingValidation = z.object({
  Muhurat: z.string().optional().nullable(),
  guests: z.number().min(0).default(0).optional(),
  seatingArrangement: z.string().optional().nullable(),
  menu: z.array(objectId("Menu")).default([]),
  sweets: z.array(objectId("Sweet")).default([]),
  additional: z.array(objectId("Additional")).default([]),
  externalItems: z.array(objectId("External")).default([]),
  starters: z.array(objectId("Starters")).default([]),
  chatMenu: z.array(objectId("ChatMenu")).default([]),
  menuType: z.enum(["buffet", "starters", "chatmenu", "customize"]).optional(),
  selectedBuffetId: objectId("BuffetName").optional().nullable(),
  mealTime: z.string().optional().nullable(),
  other: z
    .array(
      z.object({
        id: objectId("Other"),
        startTime: z.string().optional().default(""),
        endTime: z.string().optional().default(""),
      }),
    )
    .default([]),
});

// ── Step 3: Pricing Booking ───────────────────────────────────────────────────
export const PricingBookingValidation = z.object({
  totalAmount: z.number().min(0).default(0),
  additionalAmount: z.number().min(0).default(0),
  specialMenuAmount: z.number().min(0).default(0),
  subtotalamount: z.number().min(0).default(0),
  gst: z.number().min(0).default(0),

  grandTotal: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  finalAmount: z.number().min(0).default(0),
  pendingAmount: z.number().min(0).default(0),
});

// ── Full Validation (all steps combined) ──────────────────────────────────────
export const BookingValidation = BasicBookingValidation.merge(
  MenuBookingValidation,
).merge(PricingBookingValidation);

// ── Partial Updates ───────────────────────────────────────────────────────────
export const BasicBookingUpdateValidation = BasicBookingValidation.partial();
export const MenuBookingUpdateValidation = MenuBookingValidation.partial();
export const PricingBookingUpdateValidation =
  PricingBookingValidation.partial();
export const BookingUpdateValidation = BookingValidation.partial();

// ── Types ─────────────────────────────────────────────────────────────────────
export type BookingInput = z.infer<typeof BookingValidation>;
export type BookingUpdateInput = z.infer<typeof BookingUpdateValidation>;
export type BasicBookingInput = z.infer<typeof BasicBookingValidation>;
export type MenuBookingInput = z.infer<typeof MenuBookingValidation>;
export type PricingBookingInput = z.infer<typeof PricingBookingValidation>;
