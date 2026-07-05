import z from "zod";

export const grosaryListSchema = z.object({
  grosaryName: z.string().min(2, "Grosary name is required").trim(),
});

export const grosaryListUpdateValidation = z.object({
  grosaryName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
