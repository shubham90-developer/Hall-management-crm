import z from "zod";

export const otherListSchema = z.object({
  itemName: z.string().min(2, "Grosary name is required").trim(),
  price: z.string().optional(),
});

export const otherListUpdateValidation = z.object({
  itemName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  price: z.string(),
});
