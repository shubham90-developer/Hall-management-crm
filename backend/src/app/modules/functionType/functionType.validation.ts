import z from "zod";

export const functionTypeSchema = z.object({
  functionName: z.string().min(2, "Function name is required").trim(),
});

export const functionTypeUpdateValidation = z.object({
  functionName: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
});
