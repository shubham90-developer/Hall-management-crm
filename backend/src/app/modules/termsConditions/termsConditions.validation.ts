import { z } from "zod";

export const termsConditionsValidation = z.object({
  content: z.string().optional(),
});

export const termsConditionsUpdateValidation = z.object({
  content: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
