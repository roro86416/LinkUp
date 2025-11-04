import { z } from "zod";

const productBody = z.object({
  item_type: z.literal("products"),
  product_variant_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

const ticketBody = z.object({
  item_type: z.literal("ticket_types"),
  ticket_type_id: z.number().int().positive(),
  quantity: z.literal(1, { message: "票券數量必須為1" }),
});

export const addToCartSchema = z.object({
  body: z.discriminatedUnion("item_type", [productBody, ticketBody]),
});

export type AddToCartBody = z.infer<typeof addToCartSchema>["body"];
