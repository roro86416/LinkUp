// import { Router, Request, Response } from "express";
// import { PrismaClient } from "../generated/prisma/client";
// import verify from "../middleware/verify.middleware";
// import {
//   createProductSchema,
//   updateProductSchema,
//   UpdateProductBody,
// } from "../utils/products.schema";

// const prisma = new PrismaClient();
// const router = Router();

// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const products = await prisma.product.findMany({
//       include: { variants: true },
//     });
//     res.json({
//       status: "success",
//       data: products,
//     });
//   } catch (error) {
//     const e = error as Error;
//     res.status(500).json({
//       status: "error",
//       message: e.message,
//     });
//   }
// });

// router.post(
//   "/",
//   verify(createProductSchema),
//   async (req: Request, res: Response) => {
//     try {
//       const { variants, ...productData } = req.body;
//       const newProducts = await prisma.product.create({
//         data: {
//           ...productData,
//           variants: {
//             create: variants,
//           },
//           include: {
//             variants: true,
//           },
//         },
//       });
//       res.status(201).json({
//         status: "success",
//         data: newProducts,
//       });
//     } catch (error) {
//       const e = error as Error;
//       res.status(500).json({
//         status: "error",
//         message: e.message,
//       });
//     }
//   }
// );

// router.put(
//   "/:id",
//   verify(updateProductSchema),
//   async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       const { variants, ...productData } = req.body as UpdateProductBody;

//       const result = await prisma.$transaction(async (tx) => {
//         const updatedProduct = await tx.product.update({
//           where: { id: id },
//           data: productData,
//         });
//         if (variants) {
//           const variantsData = (variants || []).map((variants) => ({
//             ...variants,
//             product_id: id,
//           }));
//           await tx.productVariant.deleteMany({
//             where: {
//               product_id: id,
//             },
//           });
//           await tx.productVariant.createMany({
//             data: variantsData,
//           });
//         }
//         return updatedProduct;
//       });

//       res.json({
//         status: "success",
//         data: result,
//       });
//     } catch (error) {
//       const e = error as Error;
//       res.status(500).json({
//         status: "error",
//         message: e.message,
//       });
//     }
//   }
// );

// router.delete("/:id", async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const deleteProduct = await prisma.product.delete({
//       where: { id },
//     });
//     res.json({
//       status: "success",
//       data: deleteProduct,
//     });
//   } catch (error) {
//     const e = error as Error;
//     res.status(500).json({
//       status: "error",
//       message: "無法刪除商品",
//     });
//   }
// });

// export default router;
