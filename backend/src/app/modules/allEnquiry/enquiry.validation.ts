import z from "zod";

export const enquirySchema = z.object({
  customerName: z.string().min(2, "Name name is required").trim(),
  mobileNo: z.string().optional(),
  alternateMobileNo: z.string().optional(),
  email: z.string().optional(),
  functionName: z.string().optional(),
  date1: z.coerce.date().optional(),
  date2: z.coerce.date().optional(),
  date3: z.coerce.date().optional(),
  guestCount: z.coerce.number().optional(),
  notes: z.string().optional(),
  status: z.enum(["Pending", "Confirmed", "Hold"]).optional(),
});

export const enquiryUpdateValidation = z.object({
  customerName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  mobileNo: z.string().optional(),
  alternateMobileNo: z.string().optional(),
  email: z.string().optional(),
  functionName: z.string().optional(),
  date1: z.coerce.date().optional(),
  date2: z.coerce.date().optional(),
  date3: z.coerce.date().optional(),
  guestCount: z.coerce.number().optional(),
  notes: z.string().optional(),
  status: z.enum(["Pending", "Confirmed", "Hold"]).optional(),
});
