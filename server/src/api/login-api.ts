import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = Router();
const prisma = new PrismaClient();

// 登入
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email 和密碼必填" });
    }

    // 找使用者
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }

    // 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password_hash || "");
    if (!isMatch) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }

    // 登入成功
    res.status(200).json({ message: "登入成功", userId: user.id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

export default router;
