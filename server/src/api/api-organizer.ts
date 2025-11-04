import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client"; 

const prisma = new PrismaClient();
const router = Router();

// ---------------------------------------------
// --- 🚀 模組二 API (Organizer) 🚀 ---
// ---------------------------------------------

// ---------------------------------------------
// --- 🚀 API 1-1: 讀取活動列表 (GET) 🚀 ---
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
// --- 🚀 API 2-1: 建立新活動 (POST) 🚀 ---
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
// --- 🚀 API 2-2: 更新活動 (PUT) 🚀 ---
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
        organizer_id: MOCK_ORGANIZER_ID, 
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
// --- 🚀 API 2-3: 刪除活動 (DELETE) 🚀 ---
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
// --- 🚀 API 2-4: 複製活動 (POST) 🚀 ---
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
// --- 🚀 API 3-1: 新增活動嘉賓 (POST) 🚀 ---
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
// --- 🚀 API 3-2: 更新活動嘉賓 (PUT) 🚀 ---
// ---------------------------------------------
/*
 * API: PUT /api/v1/organizer/events/:eventId/guests/:guestId
 * 功能: 更新一位現有嘉賓的資料
 * 目的: 供給「多步驟建立表單」的「嘉賓設定」步驟使用
 */
router.put("/events/:eventId/guests/:guestId", async (req: Request, res: Response) => {
  try {
    const { eventId, guestId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const guestIdAsInt = parseInt(guestId, 10);

    if (isNaN(eventIdAsInt) || isNaN(guestIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 Guest ID" 
      });
    }

    const { name, bio, photo_url } = req.body;
    const MOCK_ORGANIZER_ID = 1;
    const guest = await prisma.eventGuest.findFirst({
      where: {
        id: guestIdAsInt,       
        event_id: eventIdAsInt, 
        event: { 
          organizer_id: MOCK_ORGANIZER_ID, 
        }
      }
    });

    if (!guest) {
      return res.status(404).json({
        status: "error",
        message: "找不到嘉賓，或您沒有權限編輯此嘉賓",
      });
    }

    const updatedGuest = await prisma.eventGuest.update({
      where: {
        id: guestIdAsInt,
      },
      data: {
        name: name,
        bio: bio,
        photo_url: photo_url,
      }
    });
    
    res.status(200).json({
      status: "success",
      data: updatedGuest,
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
// --- 🚀 API 3-3: 刪除活動嘉賓 (DELETE) 🚀 ---
// ---------------------------------------------
/*
 * API: DELETE /api/v1/organizer/events/:eventId/guests/:guestId
 * 功能: 刪除一位現有的嘉賓
 * 目的: 供給「多步驟建立表單」的「嘉賓設定」步驟使用
 */
router.delete("/events/:eventId/guests/:guestId", async (req: Request, res: Response) => {
  try {
    const { eventId, guestId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const guestIdAsInt = parseInt(guestId, 10);

    if (isNaN(eventIdAsInt) || isNaN(guestIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 Guest ID" 
      });
    }

    const MOCK_ORGANIZER_ID = 1;

    const guest = await prisma.eventGuest.findFirst({
      where: {
        id: guestIdAsInt,
        event_id: eventIdAsInt,
        event: {
          organizer_id: MOCK_ORGANIZER_ID,
        }
      }
    });

    if (!guest) {
      return res.status(404).json({
        status: "error",
        message: "找不到嘉賓，或您沒有權限刪除此嘉賓",
      });
    }

    await prisma.eventGuest.delete({
      where: {
        id: guestIdAsInt,
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
// --- 🚀 API 4-1: 新增票券種類 (POST) 🚀 ---
// ---------------------------------------------
/*
 * API: POST /api/v1/organizer/events/:eventId/ticket-types
 * 功能: 為一個活動新增票券種類 (e.g., 早鳥票, 全票) 
 * 目的: 供給「多步驟建立表單」的「票券設定」步驟使用
 */
router.post("/events/:eventId/ticket-types", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }
    const { 
      name, 
      price, 
      total_quantity, 
      sale_start_time, 
      sale_end_time 
    } = req.body;

    if (!name || price === undefined || !total_quantity || !sale_start_time || !sale_end_time) {
      return res.status(400).json({
        status: "error",
        message: "缺少必要欄位 (name, price, total_quantity, sale_start_time, sale_end_time)",
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
        message: "找不到活動，或您沒有權限為此活動新增票券",
      });
    }

    const newTicketType = await prisma.ticketType.create({
      data: {
        event_id: eventIdAsInt, 
        
        name: name,
        price: price, 
        total_quantity: total_quantity,
        sale_start_time: new Date(sale_start_time), 
        sale_end_time: new Date(sale_end_time),     
      }
    });
    
    res.status(201).json({
      status: "success",
      data: newTicketType,
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
// --- 🚀 API 4-2: 更新票券種類 (PUT) 🚀 ---
// ---------------------------------------------
/*
 * API: PUT /api/v1/organizer/events/:eventId/ticket-types/:ticketTypeId
 * 功能: 更新一個現有的票券種類
 * 目的: 供給「多步驟建立表單」的「票券設定」步驟使用
 */
router.put("/events/:eventId/ticket-types/:ticketTypeId", async (req: Request, res: Response) => {
  try {
    const { eventId, ticketTypeId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const ticketTypeIdAsInt = parseInt(ticketTypeId, 10);

    if (isNaN(eventIdAsInt) || isNaN(ticketTypeIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 TicketType ID" 
      });
    }

    const ticketTypeDataToUpdate = req.body;
    const MOCK_ORGANIZER_ID = 1;
    const ticketType = await prisma.ticketType.findFirst({
      where: {
        id: ticketTypeIdAsInt,
        event_id: eventIdAsInt,
        event: {
          organizer_id: MOCK_ORGANIZER_ID,
        }
      }
    });

    if (!ticketType) {
      return res.status(404).json({
        status: "error",
        message: "找不到票券種類，或您沒有權限編輯此票券種類",
      });
    }

    const updatedTicketType = await prisma.ticketType.update({
      where: {
        id: ticketTypeIdAsInt,
      },
      data: ticketTypeDataToUpdate,
    });
    
    res.status(200).json({
      status: "success",
      data: updatedTicketType,
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
// --- 🚀 API 4-3: 刪除票券種類 (DELETE) 🚀 ---
// ---------------------------------------------
/*
 * API: DELETE /api/v1/organizer/events/:eventId/ticket-types/:ticketTypeId
 * 功能: 刪除一個現有的票券種類
 * 目的: 供給「多步驟建立表單」的「票券設定」步驟使用
 */
router.delete("/events/:eventId/ticket-types/:ticketTypeId", async (req: Request, res: Response) => {
  try {
    const { eventId, ticketTypeId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const ticketTypeIdAsInt = parseInt(ticketTypeId, 10);

    if (isNaN(eventIdAsInt) || isNaN(ticketTypeIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 TicketType ID" 
      });
    }

    const MOCK_ORGANIZER_ID = 1;
    const ticketType = await prisma.ticketType.findFirst({
      where: {
        id: ticketTypeIdAsInt,
        event_id: eventIdAsInt,
        event: {
          organizer_id: MOCK_ORGANIZER_ID,
        }
      }
    });

    if (!ticketType) {
      return res.status(404).json({
        status: "error",
        message: "找不到票券種類，或您沒有權限刪除此票券種類",
      });
    }

    await prisma.ticketType.delete({
      where: {
        id: ticketTypeIdAsInt,
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
// --- 🚀 API 5-1: 新增優惠券 (POST) 🚀 ---
// ---------------------------------------------
/*
 * API: POST /api/v1/organizer/events/:eventId/coupons
 * 功能: 為一個活動新增專屬的優惠券 
 * 目的: 供給「多步驟建立表單」的「折扣設定」步驟使用
 */
router.post("/events/:eventId/coupons", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }
    const { 
      code, 
      discount_type, 
      value, 
      expires_at, 
      usage_limit 
    } = req.body;

    if (!code || !discount_type || value === undefined || !expires_at || !usage_limit) {
      return res.status(400).json({
        status: "error",
        message: "缺少必要欄位 (code, discount_type, value, expires_at, usage_limit)",
      });
    }
    
    if (discount_type !== 'PERCENTAGE' && discount_type !== 'FIXED_AMOUNT') {
       return res.status(400).json({
        status: "error",
        message: "discount_type 必須是 'PERCENTAGE' 或 'FIXED_AMOUNT'",
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
        message: "找不到活動，或您沒有權限為此活動新增優惠券",
      });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        event_id: eventIdAsInt, 
        
        code: code,
        discount_type: discount_type,
        value: value,
        expires_at: new Date(expires_at), 
        usage_limit: usage_limit,
      }
    });
    
    res.status(201).json({
      status: "success",
      data: newCoupon,
    });

  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Unique constraint failed on the fields: (`code`)')) {
      return res.status(409).json({ 
        status: "error",
        message: "此優惠碼 (code) 已經被使用",
      });
    }
    
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

// ---------------------------------------------
// --- 🚀 API 5-2: 更新優惠券 (PUT) 🚀 ---
// ---------------------------------------------
/*
 * API: PUT /api/v1/organizer/events/:eventId/coupons/:couponId
 * 功能: 更新一張現有優惠券的資料
 * 目的: 供給「折扣設定」步驟使用
 */
router.put("/events/:eventId/coupons/:couponId", async (req: Request, res: Response) => {
  try {
    const { eventId, couponId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const couponIdAsInt = parseInt(couponId, 10);

    if (isNaN(eventIdAsInt) || isNaN(couponIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 Coupon ID" 
      });
    }

    const couponDataToUpdate = req.body;
    const MOCK_ORGANIZER_ID = 1;
    const coupon = await prisma.coupon.findFirst({
      where: {
        id: couponIdAsInt,     
        event_id: eventIdAsInt,
        event: {
          organizer_id: MOCK_ORGANIZER_ID,
        }
      }
    });

    if (!coupon) {
      return res.status(404).json({
        status: "error",
        message: "找不到優惠券，或您沒有權限編輯此優惠券",
      });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: {
        id: couponIdAsInt,
      },
      data: couponDataToUpdate, 
    });
    
    res.status(200).json({
      status: "success",
      data: updatedCoupon,
    });

  } catch (error) {
    const e = error as Error;
    if (e.message.includes('Unique constraint failed on the fields: (`code`)')) {
      return res.status(409).json({ 
        status: "error",
        message: "此優惠碼 (code) 已經被使用",
      });
    }
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
});

// ---------------------------------------------
// --- 🚀 API 5-3: 刪除優惠券 (DELETE) 🚀 ---
// ---------------------------------------------
/*
 * API: DELETE /api/v1/organizer/events/:eventId/coupons/:couponId
 * 功能: 刪除一張現有的優惠券
 * 目的: 供給「折扣設定」步驟使用
 */
router.delete("/events/:eventId/coupons/:couponId", async (req: Request, res: Response) => {
  try {
    const { eventId, couponId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const couponIdAsInt = parseInt(couponId, 10);

    if (isNaN(eventIdAsInt) || isNaN(couponIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 Coupon ID" 
      });
    }

    const MOCK_ORGANIZER_ID = 1;
    const coupon = await prisma.coupon.findFirst({
      where: {
        id: couponIdAsInt,      
        event_id: eventIdAsInt,
        event: {
          organizer_id: MOCK_ORGANIZER_ID,
        }
      }
    });

    if (!coupon) {
      return res.status(404).json({
        status: "error",
        message: "找不到優惠券，或您沒有權限刪除此優惠券",
      });
    }

    await prisma.coupon.delete({
      where: {
        id: couponIdAsInt,
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
// --- 🚀 API 6-1: 新增活動附件 (POST) 🚀 ---
// ---------------------------------------------
/*
 * API: POST /api/v1/organizer/events/:eventId/attachments
 * 功能: 為一個活動新增附件 (例如：活動地圖、場刊)
 * 目的: 供給「多步驟建立表單」的「附件上傳」步驟使用 
 */
router.post("/events/:eventId/attachments", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);

    if (isNaN(eventIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID" 
      });
    }

    const { file_name, file_url } = req.body;

    if (!file_name || !file_url) {
      return res.status(400).json({
        status: "error",
        message: "缺少必要欄位 (file_name, file_url)",
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
        message: "找不到活動，或您沒有權限為此活動新增附件",
      });
    }

    const newAttachment = await prisma.eventAttachment.create({
      data: {
        event_id: eventIdAsInt, 
        file_name: file_name,
        file_url: file_url,
      }
    });
    
    res.status(201).json({
      status: "success",
      data: newAttachment,
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
// --- 🚀 API 6-2: 刪除活動附件 (DELETE) 🚀 ---
// ---------------------------------------------
/*
 * API: DELETE /api/v1/organizer/events/:eventId/attachments/:attachmentId
 * 功能: 刪除一個現有的附件
 * 目的: 供給「多步驟建立表單」的「附件上傳」步驟使用
 */
router.delete("/events/:eventId/attachments/:attachmentId", async (req: Request, res: Response) => {
  try {
    const { eventId, attachmentId } = req.params;
    const eventIdAsInt = parseInt(eventId, 10);
    const attachmentIdAsInt = parseInt(attachmentId, 10);

    if (isNaN(eventIdAsInt) || isNaN(attachmentIdAsInt)) {
      return res.status(400).json({ 
        status: "error", 
        message: "無效的 Event ID 或 Attachment ID" 
      });
    }
    const MOCK_ORGANIZER_ID = 1;
    const attachment = await prisma.eventAttachment.findFirst({
      where: {
        id: attachmentIdAsInt,
        event_id: eventIdAsInt,
        event: {
          organizer_id: MOCK_ORGANIZER_ID,
        }
      }
    });

    if (!attachment) {
      return res.status(404).json({
        status: "error",
        message: "找不到附件，或您沒有權限刪除此附件",
      });
    }

    await prisma.eventAttachment.delete({
      where: {
        id: attachmentIdAsInt,
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
// --- 🚀 模組二 API 結束 🚀 ---
// ---------------------------------------------

export default router;

