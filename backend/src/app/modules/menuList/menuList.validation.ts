import z from "zod";

export const menuListSchema = z.object({
  buffetName: z.array(z.string()).optional(),
  categoryName: z.string().optional(),
  itemName: z.string().optional(),
  qty: z.string().optional(),
  crocekryName: z.array(z.object({ item: z.string(), qty: z.string() })),
  grosaryName: z.array(z.object({ item: z.string(), qty: z.string() })),
  vegitablesName: z.array(z.object({ item: z.string(), qty: z.string() })),
  menuImage: z.string().optional(),
  description: z.string().optional(),
});

export const menuListUpdateValidation = z.object({
  buffetName: z.array(z.string()).optional(),

  categoryName: z.string().optional(),

  itemName: z.string().optional(),
  qty: z.string().optional(),
  crocekryName: z.array(z.object({ item: z.string(), qty: z.string() })),
  grosaryName: z.array(z.object({ item: z.string(), qty: z.string() })),
  vegitablesName: z.array(z.object({ item: z.string(), qty: z.string() })),
  menuImage: z.string().optional(),
  description: z.string().optional(),
});
