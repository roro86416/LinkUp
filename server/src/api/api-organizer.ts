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

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "缺少 'title' 欄位",
      });
    }

    //  寫死的ID，直到模組一生效
    const MOCK_ORGANIZER_ID = 1;

    const newEvent = await prisma.event.create({
      data: {
        title: title, 
        status: 'DRAFT', 
        organizer_id: MOCK_ORGANIZER_ID, 
        start_time: new Date(),
        end_time: new Date(),
        cover_image: "default_cover_image_url",
        event_type: 'OFFLINE', 
      },
    });

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
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    const eventDataToUpdate = req.body;
    const MOCK_ORGANIZER_ID = 1;
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID, // 必須同時符合這兩個條件
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到活動，或您沒有權限編輯此活動",
      });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventIdAsInt,
      },
      data: eventDataToUpdate, 
    });
    
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
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    const MOCK_ORGANIZER_ID = 1;

   
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID,
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到活動，或您沒有權限刪除此活動",
      });
    }

    await prisma.event.delete({
      where: {
        id: eventIdAsInt,
      },
    });
    
    res.status(204).send();

  } catch (error) {
    const e = error as Error;
  
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
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    const MOCK_ORGANIZER_ID = 1;

    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID,
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到要複製的活動，或您沒有權限",
      });
    }

    
    const { id, created_at, updated_at, ...dataToCopy } = existingEvent;

    const newEvent = await prisma.event.create({
      data: {
        ...dataToCopy, 
        
      
        title: `${existingEvent.title} - 複製`, 
        
        status: 'DRAFT', 
      }
    });
    
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
// --- 🚀 API 6: 新增活動嘉賓 (POST) 🚀 ---
// ---------------------------------------------

/*
 * API: POST /api/v1/organizer/events/:eventId/guests
 * 功能: 為一個活動新增嘉賓 
 * 目的: 供給「多步驟建立表單」的「嘉賓設定」步驟使用
 */
router.post("/events/:eventId/guests", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    const { name, bio, photo_url } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "缺少 'name' 欄位",
      });
    }

    const MOCK_ORGANIZER_ID = 1;

    
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventIdAsInt,
        organizer_id: MOCK_ORGANIZER_ID,
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        status: "error",
        message: "找不到活動，或您沒有權限為此活動新增嘉賓",
      });
    }

    const newGuest = await prisma.eventGuest.create({
      data: {
        name: name,
        bio: bio,
        photo_url: photo_url,
        event_id: eventIdAsInt, 
      }
    });
    
    res.status(201).json({
      status: "success",
      data: newGuest,
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