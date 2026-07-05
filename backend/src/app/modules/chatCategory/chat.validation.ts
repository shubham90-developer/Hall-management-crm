import z from "zod";

export const chatCategorySchema = z.object({
  categoryName: z.string().min(2, "Category name is required").trim(),
});

export const chatCategoryUpdateValidation = z.object({
  categoryName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
