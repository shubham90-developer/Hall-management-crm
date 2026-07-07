import { z } from "zod";

const objectId = (field: string) =>
  z
    .string(`${field} is required`)
    .regex(/^[a-fA-F0-9]{24}$/, `Invalid ${field} ID`);

export const CreateInvoiceValidation = z.object({
  booking: objectId("Booking"),
  guests: z.number().min(1, "Guests must be at least 1"),
  baseGuests: z.number().min(0).optional(),
  totalAmount: z.number().min(0).default(0),
  additionalAmount: z.number().min(0).default(0),
  gst: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  advance: z.number().min(0).default(0),
});

export const UpdateInvoiceValidation = CreateInvoiceValidation.partial();

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceValidation>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceValidation>;
