import z from "zod";

export const buffetNameSchema = z.object({
  buffetName: z.string().min(2, "Buffet name is required").trim(),
});

export const buffetNameUpdateValidation = z.object({
  buffetName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
