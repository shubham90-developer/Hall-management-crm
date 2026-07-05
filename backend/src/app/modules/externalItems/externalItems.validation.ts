import z from "zod";

export const externalItemsSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  buffet: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid buffet ID")
    .optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const externalItemsUpdateValidation = z.object({
  itemName: z.string().min(2).optional(),
  buffet: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid buffet ID")
    .optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
