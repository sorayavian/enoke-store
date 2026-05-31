import { z } from "zod";

export const checkoutItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  quantity: z.number().int().positive().max(20),
});

export const checkoutPayloadSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(20),
  customer: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().min(8).max(20).optional(),
  }),
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
