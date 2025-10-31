import { z } from "zod";

//規格規範
const variantSchema = z.object({
  option1_name: z.string().optional(),
  option1_value: z.string().optional(),
  option2_name: z.string().optional(),
  option2_value: z.string().optional(),
  sku: z.string().optional(),
  stock_quantity: z.number().int().min(0, "庫存不可為負值"),
  price_offset: z.number().default(0),
});

//新增商品規範
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "商品名稱不能為空"),
    base_price: z.number().positive("價格必須大於 0"),
    description: z.string().optional(),
    image_url: z.string().optional(),
    variants: z.array(variantSchema),
  }),
});
