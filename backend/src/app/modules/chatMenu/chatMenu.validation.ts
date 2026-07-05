import z from "zod";

export const chatMenuSchema = z.object({
  categoryName: z.string().min(2, "Category name is required").trim(),
  itemName: z.string().min(2, "Item name is required").trim(),
  price: z.string().optional(),
});

export const chatMenuUpdateValidation = z.object({
  categoryName: z.string().min(2, "Category name is required").optional(),
  itemName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  price: z.string(),
});
