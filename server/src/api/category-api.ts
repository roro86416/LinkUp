import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import express from "express"

const router = express.Router();
const prisma = new PrismaClient();

//  取得所有分類
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.postCategory.findMany({
      orderBy: { id: "asc" },
    });
    res.json(categories);
  } catch (error) {
    console.error("取得分類失敗：", error);
    res.status(500).json({ error: "伺服器錯誤，無法取得分類" });
  }
});

//  新增分類
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name?: string };

  if (!name || !name.trim()) {
    res.status(400).json({ error: "分類名稱不能為空" });
    return;
  }

  try {
    const newCategory = await prisma.postCategory.create({
      data: { name: name.trim() },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("新增分類失敗：", error);
    res.status(500).json({ error: "伺服器錯誤，無法新增分類" });
  }
});

//  修改分類
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  
  const idParam = req.params.id;
if (!idParam) {
  res.status(400).json({ error: "缺少 id 參數" });
  return;
}

const id = parseInt(idParam, 10);
if (isNaN(id)) {
  res.status(400).json({ error: "id 必須是數字" });
  return;
}

  const { name } = req.body as { name?: string };

  if (isNaN(id)) {
    res.status(400).json({ error: "ID 格式錯誤" });
    return;
  }

  try {
    const updated = await prisma.postCategory.update({
      where: { id },
      data: { name:String(name) },
    });
    res.json(updated);
  } catch (error) {
    console.error("修改分類失敗：", error);
    res.status(500).json({ error: "伺服器錯誤，無法修改分類" });
  }
});

//  刪除分類
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
   const idParam = req.params.id;
if (!idParam) {
  res.status(400).json({ error: "缺少 id 參數" });
  return;
}

const id = parseInt(idParam, 10);
if (isNaN(id)) {
  res.status(400).json({ error: "id 必須是數字" });
  return;
}
  if (isNaN(id)) {
    res.status(400).json({ error: "ID 格式錯誤" });
    return;
  }

  try {
    await prisma.postCategory.delete({ where: { id } });
    res.json({ message: "分類已刪除" });
  } catch (error) {
    console.error("刪除分類失敗：", error);
    res.status(500).json({ error: "伺服器錯誤，無法刪除分類" });
  }
});

export default router;
