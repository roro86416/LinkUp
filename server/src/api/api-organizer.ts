//server/src/api/api-organizer.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client"; 

const prisma = new PrismaClient();
const router = Router();

// ---------------------------------------------
// --- 🚀 模組二 API 🚀 ---
// ---------------------------------------------

/*
 * API: GET /api/v1/organizer/events
 * 功能: 取得主辦方的活動列表
 * 目的: 供給「主辦方儀表板」 使用
 */
router.get("/events", async (req: Request, res: Response) => {
  try {
    // 暫時寫死主辦方 ID (organizer_id = 1) 來測試
    const MOCK_ORGANIZER_ID = 1; 

    const events = await prisma.event.findMany({
      where: {
        organizer_id: MOCK_ORGANIZER_ID,
      },
      orderBy: {
        start_time: 'desc',
      },
    });

    res.json({
      status: "success",
      data: events,
    });

  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});
// ---------------------------------------------
// --- 🚀 API 2: 建立新活動 (POST) 🚀 ---
// ---------------------------------------------

/*
 * API: POST /api/v1/organizer/events
 * 功能: 建立一個新的「草稿」活動
 * 目的: 供給「多步驟建立表單」 的第一步使用
 */
router.post("/events", async (req: Request, res: Response) => {
  try {
    // 1. 從前端的請求 "Body" 中獲取新活動的標題
    // (前端未來會傳送 {"title": "我的新活動"} 過來)
    const { title } = req.body;

    // 2. 驗證標題是否存在
    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "缺少 'title' 欄位",
      });
    }

    // 3. 寫死」的ID，直到模組一生效
    const MOCK_ORGANIZER_ID = 1;

    // 4. 使用 Prisma Client 建立新活動
    const newEvent = await prisma.event.create({
      data: {
        title: title, // 來自 req.body
        status: 'DRAFT', // !! 新活動預設為草稿 !!
        organizer_id: MOCK_ORGANIZER_ID, // 連結到主辦方
        start_time: new Date(),
        end_time: new Date(),
        cover_image: "default_cover_image_url",
        event_type: 'OFFLINE', // 預設為線下
      },
    });

    // 5. 回傳 201 (Created) 並附上新建立的活動資料
    res.status(201).json({
      status: "success",
      data: newEvent,
    });

  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

// ---------------------------------------------
// --- 🚀 API 3: 更新活動 (PUT) 🚀 ---
// ---------------------------------------------

/*
 * API: PUT /api/v1/organizer/events/:eventId
 * 功能: 更新一個現有的活動
 * 目的: 供給「儲存草稿」或「編輯活動」功能使用
 */
router.put("/events/:eventId", async (req: Request, res: Response) => {
  try {
    // 1. 從 URL 取得 eventId，並轉為數字
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    // 檢查 eventId 是否為有效數字
    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    // 2. 從 request body 取得要更新的資料 (例如: { "title": "更新後的標題" })
    const eventDataToUpdate = req.body;

    // 3. 模擬登入者 ID
    const MOCK_ORGANIZER_ID = 1;

    // 4. (!! 關鍵安全檢查 !!)
    // 在更新之前，必須先確認這筆活動存在，"且" 它是屬於這位主辦方的
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID, // 必須同時符合這兩個條件
      }
    });

    // 5. 如果找不到，或這筆活動不屬於你
    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到活動，或您沒有權限編輯此活動",
      });
    }

    // 6. (安全) 確認可以更新，執行 Prisma 更新
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventIdAsInt,
      },
      // 將前端傳來的 body (e.g., { title: "New Title", status: "PENDING" }) 更新進去
      data: eventDataToUpdate, 
    });
    
    // 7. 回傳成功與更新後的活動資料
    res.json({
      status: "success",
      data: updatedEvent,
    });

  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

// ---------------------------------------------
// --- 🚀 API 4: 刪除活動 (DELETE) 🚀 ---
// ---------------------------------------------

/*
 * API: DELETE /api/v1/organizer/events/:eventId
 * 功能: 刪除一個現有的活動
 * 目的: 供給「快速操作」的「刪除」按鈕使用 
 */
router.delete("/events/:eventId", async (req: Request, res: Response) => {
  try {
    // 1. 從 URL 取得 eventId，並轉為數字
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    // 2. 檢查 eventId 是否為有效數字
    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    // 3. 模擬登入者 ID
    const MOCK_ORGANIZER_ID = 1;

    // 4. (!! 關鍵安全檢查 !!)
    // 在刪除之前，必須先確認這筆活動存在，"且" 它是屬於這位主辦方的
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID,
      }
    });

    // 5. 如果找不到，或這筆活動不屬於你
    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到活動，或您沒有權限刪除此活動",
      });
    }

    // 6. (安全) 確認可以刪除，執行 Prisma 刪除
    await prisma.event.delete({
      where: {
        id: eventIdAsInt,
      },
    });
    
    // 7. 回傳 204 (No Content)，代表成功刪除，不需要回傳任何資料
    res.status(204).send();

  } catch (error) {
    const e = error as Error;
    // (注意: 如果刪除的活動有關聯的子項目，例如 TicketType，
    // 且 onDelete 不是 Cascade，這裡可能會報錯)
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

// ---------------------------------------------
// --- 🚀 API 5: 複製活動 (POST) 🚀 ---
// ---------------------------------------------

/*
 * API: POST /api/v1/organizer/events/:eventId/copy
 * 功能: 複製一個現有的活動 
 * 目的: 供給「快速操作」的「複製」按鈕使用 
 */
router.post("/events/:eventId/copy", async (req: Request, res: Response) => {
  try {
    // 1. 從 URL 取得 eventId，並轉為數字
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    // 2. 檢查 eventId 是否為有效數字
    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    // 3. 模擬登入者 ID
    const MOCK_ORGANIZER_ID = 1;

    // 4. (!! 關鍵安全檢查 !!)
    // 找到我們要複製的「來源」活動，並確認它屬於這位主辦方
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID,
      }
    });

    // 5. 如果找不到
    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到要複製的活動，或您沒有權限",
      });
    }

    // 6. 準備要複製的資料
    // (我們使用 "..." 展開運算子來複製所有欄位，
    //  並手動覆蓋 "id", "created_at", "updated_at" 讓 Prisma 自動生成)
    const { id, created_at, updated_at, ...dataToCopy } = existingEvent;

    // 7. (!! 關鍵 !!) 建立一個新活動
    const newEvent = await prisma.event.create({
      data: {
        ...dataToCopy, // 複製所有舊資料
        
        // --- 覆蓋特定欄位 ---
        // (1) 標題加上 " - 複製" 以供區別
        title: `${existingEvent.title} - 複製`, 
        
        // (2) 狀態必須重設為 DRAFT (草稿) [cite: 109, 111]
        status: 'DRAFT', 
      }
    });
    
    // 8. 回傳 201 (Created)，並附上「新的」活動資料
    res.status(201).json({
      status: "success",
      data: newEvent,
    });

  } catch (error) {
    const e = error as Error;
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

// ---------------------------------------------
// --- 🚀 模組二 API 結束 🚀 ---
// ---------------------------------------------

export default router;