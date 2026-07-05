import z from "zod";

export const otherMenuSchema = z.object({
  buffetName: z.array(z.string()).min(1, "Select at least one buffet"),
  itemName: z.string().min(2).trim().optional(),
  price: z.number("Price is required").min(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const otherMenuUpdateValidation = z.object({
  buffetName: z.array(z.string()).optional(),
  itemName: z.string().min(2).trim().optional(),
  price: z.number().min(0).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
