import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
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
    const newProducts = await prisma.product.create({
      data: req.body,
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

export default router;
