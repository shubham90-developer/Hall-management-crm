import z from "zod";

export const sweetMenuSchema = z.object({
  buffetName: z.array(z.string()).min(1, "Select at least one buffet"),

  itemName: z.string().min(2).trim().optional(),

  price: z.string().optional(),
});

export const sweetMenuUpdateValidation = z.object({
  buffetName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),

  itemName: z.string().min(2).trim().optional(),

  price: z.string().optional(),
});
