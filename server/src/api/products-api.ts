import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
    });
    res.json({
      status: "success",
      data: products,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { variants, ...productData } = req.body;
    const newProducts = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
        include: {
          variants: true,
        },
      },
    });
    res.status(201).json({
      status: "success",
      data: newProducts,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const dataToUpdate = req.body;
    const updateProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
    res.json({
      status: "success",
      data: updateProduct,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleteProduct = await prisma.product.delete({
      where: { id },
    });
    res.json({
      status: "success",
      data: deleteProduct,
    });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: "無法刪除商品",
    });
  }
});

export default router;
