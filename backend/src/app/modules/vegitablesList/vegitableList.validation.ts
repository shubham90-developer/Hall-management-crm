import z from "zod";

export const vegitablesListSchema = z.object({
  vegitablesName: z.string().min(2, "Vegitables name is required").trim(),
});

export const vegitablesListUpdateValidation = z.object({
  vegitablesName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
