//server/src/index.ts
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import organizerRoutes from "./api/api-organizer";

// --- 伺服器設定 ---
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

// --- 中間件 (Middlewares) ---
app.use(cors());
app.use(express.json()); 

// --- API 路由註冊 (Routes) ---

// 1. 測試路由
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "愛來自LinkUp伺服器! 🚀" });
});

// 2. 模組三 (產品) 路由 
// app.use("/api/v1/products", productRoutes);

// 3. 模組二 (主辦方) 路由
app.use("/api/v1/organizer", organizerRoutes);

// --- 啟動伺服器 ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});