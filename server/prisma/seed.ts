// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// 預期的活動類別資料 (注意：我們不指定 ID，讓 DB 自動生成)
const categories = [
  "課程", "展覽", "派對", "聚會", "市集", "比賽", "表演",
  "研討會", "分享會", "見面會", "宣傳活動", "導覽", "體驗"
].map(name => ({ name }));


async function main() {
  console.log("🌱 正在開始類別 Seeding...");

  // 1. 清除舊的 Category 資料 (可選，但可確保資料庫乾淨)
  // 如果你使用 SQLITE 或需要清空資料，可以加上這行：
  // await prisma.category.deleteMany({});
  
  // 2. 插入所有主要類別
  const result = await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // 如果分類名稱已存在，則跳過，避免報錯
  });

  console.log(`✅ 成功插入/跳過 ${result.count} 個活動類別。`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✨ Seeding 流程完成。");
  })
  .catch(async (e) => {
    console.error("❌ Seeding 失敗：", e);
    await prisma.$disconnect();
    process.exit(1);
  });