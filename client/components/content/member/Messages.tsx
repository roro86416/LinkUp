import React, { useState, useMemo, useCallback } from 'react';

// ----------------------------------------------------
// 1. 類型定義 (Type Definitions)
// ----------------------------------------------------

// 定義訊息資料的結構
interface Message {
  id: number;
  type: 'registration_success' | 'payment_reminder' | 'attendance_notice' | 'event_reminder';
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  eventName: string;
}

// 定義 MessageCard 組件的 Props 結構
interface MessageCardProps {
  message: Message;
  // onToggleRead 接收訊息 ID (number) 並返回 void
  onToggleRead: (id: number) => void;
  // onDelete 接收訊息 ID (number) 和標題 (string) 並返回 void
  onDelete: (id: number, title: string) => void;
}

// ----------------------------------------------------
// 2. 模擬資料與配置 (Initial State & Config)
// ----------------------------------------------------

// 模擬資料 (Initial Mock Data) - 使用 Message[] 類型
const initialMessageData: Message[] = [
  { id: 1, type: 'registration_success', title: '恭喜！您已成功報名「智慧城市研討會」', content: '您已成功報名 2025/11/15 舉辦的「智慧城市研討會」。請留意後續通知，活動出席通知將於活動前一天發送。', date: '2025/10/25 10:30', isRead: false, eventName: '智慧城市研討會' },
  { id: 2, type: 'payment_reminder', title: '【重要】「AI 工作坊」繳款期限將至！', content: '您的活動「AI 工作坊」繳款期限為 2025/11/02，請盡快完成繳費，以免影響報名資格。', date: '2025/10/30 14:00', isRead: false, eventName: 'AI 工作坊' },
  { id: 3, type: 'attendance_notice', title: '「網頁設計趨勢」活動出席通知', content: '您報名的活動將於明天 2025/10/31 舉行！請提前準備好您的電子票券。地點：台北國際會議中心。', date: '2025/10/30 08:00', isRead: false, eventName: '網頁設計趨勢' },
  { id: 4, type: 'event_reminder', title: '活動提醒：「資料分析入門」將在一小時後開始！', content: '「資料分析入門」將於 15:00 開始，請您立即前往線上會議室或活動地點。', date: '2025/10/29 14:00', isRead: true, eventName: '資料分析入門' },
  { id: 5, type: 'payment_reminder', title: '「商業攝影教學」繳款已過期通知', content: '很抱歉，您的活動「商業攝影教學」繳款期限已過，您的報名資格已取消。', date: '2025/10/28 16:20', isRead: true, eventName: '商業攝影教學' },
  { id: 6, type: 'registration_success', title: '報名成功：數位行銷大師班', content: '您已成功報名 2025/12/01 的「數位行銷大師班」。', date: '2025/10/27 09:00', isRead: true, eventName: '數位行銷大師班' },
  { id: 7, type: 'event_reminder', title: '倒數一天：「區塊鏈技術應用」', content: '您報名的「區塊鏈技術應用」活動將於明天開始，請做好最後準備！', date: '2025/10/29 10:00', isRead: false, eventName: '區塊鏈技術應用' },
];

// 圖標和顏色配置 (使用 inline SVG 保持單一檔案)
const getTypeConfig = (type: Message['type']) => {
  const iconBaseProps = { className: "h-6 w-6" };
  const svgPathMap = {
    'registration_success': {
      path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-green-500",
      label: '報名成功',
    },
    'payment_reminder': {
      path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-red-500",
      label: '繳費提醒',
    },
    'attendance_notice': {
      path: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
      color: "text-indigo-500",
      label: '出席通知',
    },
    'event_reminder': {
      path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-yellow-500",
      label: '活動提醒',
    },
  };

  const config = svgPathMap[type];

  if (!config) {
    return { icon: null, label: '一般通知' };
  }

  const Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconBaseProps} className={`${iconBaseProps.className} ${config.color}`}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.path} />
    </svg>
  );

  return { icon: <Icon />, label: config.label };
};

// ----------------------------------------------------
// 3. 組件：訊息卡片 (Message Card Component)
// ----------------------------------------------------

const MessageCard: React.FC<MessageCardProps> = ({ message, onToggleRead, onDelete }) => {
  const { icon, label } = getTypeConfig(message.type);
  const isReadClass = message.isRead ? 'bg-white border-l-4 border-l-gray-300' : 'bg-gray-50 border-l-4 border-l-indigo-600';
  const readToggleText = message.isRead ? '標記為未讀' : '標記為已讀';

  return (
    <div id={`message-${message.id}`}
      className={`message-card p-5 rounded-xl shadow-md transition duration-200 ease-in-out ${isReadClass} hover:translate-y-[-2px] hover:shadow-xl`}>

      <div className="flex items-start justify-between">
        {/* 左側內容 */}
        <div className="flex-grow min-w-0 pr-4">
          <div className="flex items-center space-x-3 mb-2">
            {icon}
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {message.title}
            </h2>
            {!message.isRead && (
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" title="未讀訊息"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2 whitespace-normal">{message.content}</p>
          <div className="text-xs text-gray-400 mt-1 flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{label}</span>
            <span>{message.date}</span>
          </div>
        </div>

        {/* 右側操作按鈕 */}
        <div className="flex flex-col space-y-2 flex-shrink-0">
          <button onClick={() => onToggleRead(message.id)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 p-1 rounded-md hover:bg-indigo-50 whitespace-nowrap">
            {readToggleText}
          </button>
          <button onClick={() => onDelete(message.id, message.title)}
            className="text-xs font-medium text-red-500 hover:text-red-700 transition duration-150 p-1 rounded-md hover:bg-red-50">
            刪除
          </button>
        </div>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// 4. 主組件 (App Component)
// ----------------------------------------------------

const App: React.FC = () => {
  // 使用 Message[] 作為 useState 的類型
  const [messageData, setMessageData] = useState<Message[]>(initialMessageData);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  // Tab 定義 (使用 useMemo 來確保計數只在 messageData 變化時重新計算)
  const tabs = useMemo(() => [
    { id: 'all', name: '全部', count: messageData.length },
    { id: 'unread', name: '未讀', count: messageData.filter(m => !m.isRead).length },
    { id: 'read', name: '已讀', count: messageData.filter(m => m.isRead).length },
  ], [messageData]);

  // 篩選和搜尋邏輯 (使用 useMemo 來避免不必要的重複計算)
  const filteredMessages = useMemo(() => {
    let list = messageData;
    const lowerSearchTerm = currentSearchTerm.toLowerCase().trim();

    // 1. 執行 Tab 篩選
    if (currentFilter === 'unread') {
      list = list.filter(m => !m.isRead);
    } else if (currentFilter === 'read') {
      list = list.filter(m => m.isRead);
    }

    // 2. 執行搜尋篩選
    if (lowerSearchTerm) {
      list = list.filter(m =>
        m.title.toLowerCase().includes(lowerSearchTerm) ||
        m.content.toLowerCase().includes(lowerSearchTerm) ||
        m.eventName.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return list;
  }, [messageData, currentFilter, currentSearchTerm]);


  // 處理函數
  const toggleReadStatus = useCallback((id: number) => {
    setMessageData(prevData => prevData.map(msg =>
      msg.id === id ? { ...msg, isRead: !msg.isRead } : msg
    ));
  }, []);

  const deleteMessage = useCallback((id: number, title: string) => {
    // 使用 window.confirm 替代 alert/confirm (React 應用中應使用 Modal)
    if (window.confirm(`確定要刪除訊息：「${title}」嗎？`)) {
      setMessageData(prevData => prevData.filter(msg => msg.id !== id));
      console.log(`Message ID ${id} deleted.`);
    }
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(e.target.value);
  }, []);

  const setFilter = useCallback((filterId: 'all' | 'unread' | 'read') => {
    setCurrentFilter(filterId);
  }, []);


  return (
    <div id="app" className="w-full mx-auto">
      <header>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          訊息中心
        </h1>
        <p className="text-gray-500">管理您的所有活動通知和提醒。</p>
      </header>

      {/* 篩選器和搜尋框區域 */}
      <div className=" p-4  mt-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">

          {/* 篩選 Tabs */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <div id="filter-tabs" className="inline-flex rounded-lg bg-gray-100 p-1">
              {tabs.map(tab => {
                const isActive = tab.id === currentFilter;
                const activeClass = isActive
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-700 font-medium';

                return (
                  <button key={tab.id} onClick={() => setFilter(tab.id as 'all' | 'unread' | 'read')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition duration-150 ${activeClass}`}>
                    {tab.name} ({tab.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 搜尋框 */}
          <div className="relative w-full sm:max-w-xs">
            <input type="text" id="search-input" placeholder="搜尋標題、內容或活動名稱..."
              className="w-full border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-indigo-600 focus:border-indigo-600 transition duration-150"
              onChange={handleSearch}
              value={currentSearchTerm} />
            {/* 搜尋圖標 */}
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 訊息列表 */}
      <div id="message-list" className={`message-list-container space-y-4 max-h-[70vh] overflow-y-auto pr-2 ${filteredMessages.length === 0 ? 'hidden' : 'block'}`}>
        {filteredMessages.map(message => (
          <MessageCard
            key={message.id}
            message={message}
            onToggleRead={toggleReadStatus}
            onDelete={deleteMessage}
          />
        ))}
      </div>

      {/* 空狀態/無結果提示 */}
      <div id="empty-state" className={`text-center py-20 bg-white rounded-xl shadow-lg ${filteredMessages.length === 0 ? 'block' : 'hidden'}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">沒有符合條件的訊息</h3>
        <p className="mt-1 text-sm text-gray-500">請嘗試更改篩選或搜尋條件。</p>
      </div>

    </div>
  );
};

export default App;
