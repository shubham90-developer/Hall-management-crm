import z from "zod";

export const enquirySchema = z.object({
  customerName: z.string().min(2, "Name name is required").trim(),
  mobileNo: z.string().optional(),
  alternateMobileNo: z.string().optional(),
  email: z.string().optional(),
  functionName: z.string().optional(),
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
});
