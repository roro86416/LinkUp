// import express, { Router, Request, Response, NextFunction } from "express";
// // import { PrismaClient } from "../generated/prisma/client";
// // import verify from "../middleware/verify.middleware";
// // import { addToCartSchema, AddToCartBody } from "../utils/cart.schema";
// import {z} from "zod"
// const router: Router = express.Router();
// // const prisma = new PrismaClient();

// const MOCK_USER_ID = 1;

// /**
//  * @route POST /api/cart
//  * @desc 新增商品「或」票券到購物車 (已升級)
//  */
// router.post(
//   "/",
//   verify(addToCartSchema), // 1. 使用「升級後」的 Zod 藍圖
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const body = req.body as AddToCartBody;
//       const userId = MOCK_USER_ID;

//       // 3. 取得購物車 (這段不變)
//       const cart = await prisma.cart.upsert({
//         where: { user_id: userId },
//         create: { user_id: userId },
//         update: {},
//         select: { id: true },
//       });
//       const cart_id = cart.id;

//       // --- 4. 關鍵分流邏輯 ---

//       if (body.item_type === "products") {
//         // ========= 這是「商品」的邏輯 (已修正錯誤一) =========
//         // (我們改回使用 "findFirst" + "if/else" 邏輯)

//         // (a) 尋找現有項目
//         const existingItem = await prisma.cartItem.findFirst({
//           where: {
//             cart_id: cart_id,
//             product_variant_id: body.product_variant_id,
//             item_type: "products", // 確保我們找的是商品
//           },
//         });

//         // (b) 檢查庫存
//         const newTotalQuantity = (existingItem?.quantity || 0) + body.quantity;
//         const variant = await prisma.productVariant.findUnique({
//           where: { id: body.product_variant_id },
//           select: { stock_quantity: true },
//         });

//         if (!variant) {
//           throw new Error("找不到該商品規格");
//         }
//         if (variant.stock_quantity < newTotalQuantity) {
//           throw new Error(`庫存不足！剩餘庫存：${variant.stock_quantity}`);
//         }

//         // (c) 根據 existingItem 決定是 create 還是 update
//         let resultItem;
//         if (existingItem) {
//           // 如果存在：更新
//           resultItem = await prisma.cartItem.update({
//             where: { id: existingItem.id },
//             data: {
//               quantity: {
//                 increment: body.quantity, // 累加數量
//               },
//             },
//           });
//         } else {
//           // 如果不存在：建立
//           resultItem = await prisma.cartItem.create({
//             data: {
//               cart_id: cart_id,
//               item_type: "products",
//               product_variant_id: body.product_variant_id,
//               quantity: body.quantity,
//             },
//           });
//         }

//         res.status(200).json({ status: "success", data: resultItem });
//       } else if (body.item_type === "ticket_types") {
//         // ========= 這是「票券」的新邏輯 (已修正錯誤二、三) =========

//         // (錯誤二、三的修正)：
//         // 由於 'TicketType' model 尚未在您的 schema.prisma 中定義，
//         // Prisma Client 中沒有 'ticketType' 也無法進行巢狀查詢 'ticket_type'。
//         // 我們必須暫時回傳一個「尚未實作」的錯誤。

//         return res.status(501).json({
//           status: "error",
//           message: "票券功能 (模組二) 尚未整合，schema.prisma 檔案尚未合併",
//         });

//         /* // --- (未來) 當 'TicketType' model 合併到 schema.prisma 後，
//         // --- 並且您在 CartItem model 中補上了 'ticket_type' 的 @relation
//         // --- 您就可以啟用這段邏輯 ---
        
//         // (a) 取得票券的 event_id
//         const ticketType = await prisma.ticketType.findUnique({
//           where: { id: body.ticket_type_id },
//           select: { event_id: true }, 
//         });
//         if (!ticketType) throw new Error("找不到此票券種類");
//         if (!ticketType.event_id) throw new Error("此票券未關聯任何活動");

//         // (b) 檢查購物車是否已有同活動的票
//         const existingTicketInCart = await prisma.cartItem.findFirst({
//           where: {
//             cart_id: cart_id,
//             item_type: "ticket_types",
//             ticket_type: { // (需要 schema.prisma 支援)
//               event_id: ticketType.event_id,
//             },
//           },
//         });
//         if (existingTicketInCart) {
//           throw new Error("您的購物車中已經有此活動的票券");
//         }
        
//         // (c) 新增票券
//         const newTicketItem = await prisma.cartItem.create({
//           data: {
//             cart_id: cart_id,
//             item_type: "ticket_types",
//             ticket_type_id: body.ticket_type_id,
//             quantity: 1,
//           },
//         });
//         res.status(200).json({ status: "success", data: newTicketItem });
//         */
//       }
//     } catch (error) {
//       // 不論是「庫存不足」或「票券重複」，都會在這裡被 next 捕獲
//       next(error);
//     }
//   }
// );

// // @route GET /api/Cart
// // @desc 取得目前使用者的購物車內容

// router.get("/", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = MOCK_USER_ID;

//     //找到使用者的購物車，並載入相關資料
//     const cart = await prisma.cart.findUnique({
//       where: { user_id: userId },
//       include: {
//         items: {
//           orderBy: { added_at: "desc" },
//           include: {
//             product_variant: {
//               include: {
//                 product: true,
//               },
//             },
//           },
//         },
//       },
//     });
//     if (!cart) {
//       return res.status(200).json({
//         status: "success",
//         data: {
//           id: null,
//           user_id: userId,
//           items: [],
//         },
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       data: cart,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// export const cartItemParamSchema = z.object({
//     params: z.object({
//         cartItemId:z.string().transform((val, ctx)=>)
//     })
// })

// export default router;
