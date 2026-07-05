import z from "zod";

export const startersMenuSchema = z.object({
  categoryName: z.string().min(2, "Category name is required").trim(),

  itemName: z.string().min(2).trim().optional(),

  price: z.string().optional(),
});

export const startersMenuUpdateValidation = z.object({
  categoryName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),

  itemName: z.string().min(2).trim().optional(),

  price: z.string().optional(),
});
