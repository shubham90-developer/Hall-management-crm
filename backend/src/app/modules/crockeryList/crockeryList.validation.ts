import z from "zod";

export const crockeryListSchema = z.object({
  crocekryName: z.string().min(2, "Crockery name is required").trim(),
});

export const crockeryListUpdateValidation = z.object({
  crocekryName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
