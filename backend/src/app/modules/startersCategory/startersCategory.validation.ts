import z from "zod";

export const startersCategorySchema = z.object({
  categoryName: z.string().min(2, "Category name is required").trim(),
});

export const startersCategoryUpdateValidation = z.object({
  categoryName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
