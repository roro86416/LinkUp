import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = Router();
const prisma = new PrismaClient();

// 註冊
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email 和密碼必填" });
    }

    // 檢查是否已存在
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "使用者已存在" });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立使用者
    const user = await prisma.users.create({
      data: {
        email,
        password_hash: hashedPassword
      }
    });

    // 建立 profile
    await prisma.user_profiles.create({
      data: {
        user_id: user.id,
        name: name || ""
      }
    });

    res.status(201).json({ message: "註冊成功", userId: user.id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

export default router;
