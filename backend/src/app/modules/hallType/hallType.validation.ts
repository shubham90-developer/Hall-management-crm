import { z } from "zod";

export const hallTypeValidation = z.object({
  hallName: z.string().min(2, "Title must be at least 2 characters long"),
});

export const hallTypeUpdateValidation = z.object({
  hallName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
