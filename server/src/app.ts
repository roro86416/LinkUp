// server/src/app.ts
import dotenv from "dotenv";
dotenv.config(); // 🔹 dotenv 最前面，確保 process.env 可用

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import registerRoutes from "./api/register-api.js"; // 不加 .js，TypeScript 自動解析

// 建立 Express app 與 Prisma client
const app: Express = express();
const prisma = new PrismaClient();

// --- 中間件 ---
app.use(cors({ origin: "http://localhost:3000" })); // 前端 Next.js 預設 3000
app.use(express.json());

// --- 環境變數檢查 ---
console.log("🚀 Environment variables:", { DATABASE_URL: process.env.DATABASE_URL });

// --- 測試路由 ---
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自LinkUp伺服器! 🚀" });
});

// --- 註冊路由 ---
// 將 register-api.ts 的 router 掛載到 /api/register
app.use("/api/register", registerRoutes);

// --- 登入 API ---
app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email 和密碼必填" });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "使用者不存在" });

    const isValid = await bcrypt.compare(password, user.password_hash || "");
    if (!isValid) return res.status(401).json({ message: "密碼錯誤" });

    res.status(200).json({ message: "登入成功", userId: user.id });
  } catch (err: any) {
    console.error("登入錯誤:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default app;
