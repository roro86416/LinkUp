import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// 現有模組路由
import organizerRoutes from "./api/api-organizer.js";
import productRoutes from "./api/products-api.js";

dotenv.config();
const app: Express = express();
const prisma = new PrismaClient();

// --- 中間件 ---
app.use(cors());
app.use(express.json());

// --- 測試路由 ---
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自LinkUp伺服器! 🚀" });
});

// --- 註冊 API ---
app.post("/api/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 先建立 user，再建立 profile 避免一對一關聯錯誤
    const user = await prisma.users.create({
      data: { email, password_hash: hashedPassword },
    });

    await prisma.user_profiles.create({
      data: { user_id: user.id, name: name || "" },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// --- 登入 API ---
app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password_hash || "");
    if (!isValid) return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// --- 產品路由 (模組三) ---
app.use("/api/v1/products", productRoutes);

// --- 主辦方路由 (模組二) ---
app.use("/api/v1/organizer", organizerRoutes);

export default app;
