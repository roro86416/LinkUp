'use client';

import { Dispatch, SetStateAction, ReactNode } from 'react'; // 導入 Dispatch 和 SetStateAction 類型
// ❌ 修正錯誤：移除 react-icons/fa 導入，因為它無法解析。

// 假設 next/image 無法使用，我們將使用 img 標籤作為備用，並在註釋中說明
// import Image from 'next/image'; 

interface MenuItem {
  label: string;
  icon: ReactNode; // 修正: 使用 ReactNode 來包含 圖示元件
}

// ⚠️ 修正：擴展 SidebarProps，加入 UserLayout 傳遞的所有 props 類型
export interface SidebarProps {
  type: 'member' | 'admin';
  activeMenu: string; // 接收當前活躍的選單名稱
  onMenuChange: Dispatch<SetStateAction<string>>; // 接收 setState 函式
}

// --- 內聯 SVG 圖示組件，取代 Emoji ---

// 設定/齒輪圖示
const GearIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.05c0 1.25-.97 2.37-2.3 2.7l-.02.01a.34.34 0 0 1-.41-.24l-.12-.7c-.3-.8-.94-1.42-1.72-1.7L4 4.54l-1.74 3.02a2 2 0 0 0 .5 2.18l.01.01c.88.92 1.9 2.02 2.7 3.25l.04.06c.07.1.1.22.09.34l-.07.41c-.2.95-.53 1.9-.97 2.77L4.54 20l3.02 1.74a2 2 0 0 0 2.18-.5l.01-.01c.92-.88 2.02-1.9 3.25-2.7l.06-.04a.34.34 0 0 1 .34-.09l.41.07c.95.2 1.9.53 2.77.97L20 19.46l1.74-3.02a2 2 0 0 0-.5-2.18l-.01-.01c-.88-.92-1.9-2.02-2.7-3.25l-.04-.06a.34.34 0 0 1-.09-.34l.07-.41c.2-.95.53-1.9.97-2.77L19.46 4l-3.02-1.74a2 2 0 0 0-2.18.5l-.01.01c-.92.88-2.02 1.9-3.25 2.7l-.06.04a.34.34 0 0 1-.34.09l-.41-.07c-.95-.2-1.9-.53-2.77-.97L4 4.54ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
);
// 訊息圖示
const MessageIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
// 收藏/愛心圖示
const HeartIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);
// 儀表板/圖表圖示
const ChartIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
);
// 使用者/會員圖示
const UserIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
// 內容/文件編輯圖示
const FileEditIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
);
// 訂單/包裹圖示
const PackageIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 2.89a2 2 0 0 0-1.78 0L3.8 6.47a2 2 0 0 0-1 1.75v8.52a2 2 0 0 0 1 1.75l7.31 3.58a2 2 0 0 0 1.78 0l7.31-3.58a2 2 0 0 0 1-1.75V8.22a2 2 0 0 0-1-1.75l-7.31-3.58z" /><polyline points="3.29 7.43 12 11.23 20.71 7.43" /><line x1="12" y1="11.23" x2="12" y2="21.57" /><polyline points="2.89 16.57 12 20.37 21.11 16.57" /></svg>
);


// 使用內聯 SVG 替代 FaCamera (標準相機圖示)
const CameraIcon = () => (
  // 修正：確保 strokeLinejoin 屬性使用小寫 'j'
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3L14.5 4z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);


// 修正：從 props 中解構所有需要的屬性
export default function Sidebar({ type, activeMenu, onMenuChange }: SidebarProps) {

  const menus: MenuItem[] =
    type === 'member'
      ? [
        // 替換為 SVG 組件
        { label: '帳號設定', icon: <GearIcon /> },
        { label: '訊息管理', icon: <MessageIcon /> },
        { label: '我的收藏', icon: <HeartIcon /> },
      ]
      : [
        // 管理員選單項目 - 替換為 SVG 組件
        { label: '後台總覽', icon: <ChartIcon /> },
        { label: '主辦方管理', icon: <UserIcon /> },
        { label: '活動管理', icon: <FileEditIcon /> },
        { label: '交易管理', icon: <PackageIcon /> },
        { label: '系統公告管理', icon: <GearIcon /> },
      ];

  return (
    // 1. 增強整體設計：更圓的邊角, 更深的陰影，更大的間距
    <aside className="bg-white w-[280px] h-[660px] rounded-2xl p-6 flex flex-col gap-8 shadow-2xl shadow-gray-200/50">

      {/* 大頭照區塊 */}
      <div className="relative w-[120px] h-[120px] mx-auto group">
        {/* 假設無法使用 next/image，使用原生 img 標籤 */}
        <img
          src="https://placehold.co/120x120/E0E7FF/3730A3?text=Avatar" // 使用 Placeholder 圖像
          alt="avatar"
          className="w-full h-full rounded-full object-cover border-4 border-indigo-100 ring-2 ring-indigo-300 transition duration-300 group-hover:ring-4"
        />
        {/* 2. 相機 icon 美化：使用主色調，增加陰影和懸停效果 */}
        <button
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full border-4 border-white shadow-lg hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="Upload Avatar"
        >
          {/* 替換為內聯 SVG */}
          <CameraIcon />
        </button>
      </div>

      {/* 使用者名稱區塊 (新增) */}
      <div className="text-center">
        <p className="text-xl font-bold text-gray-800">
          {type === 'member' ? '普通會員' : '系統管理員'}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">user@example.com</p>
      </div>

      {/* 選單列表 */}
      <div className='flex flex-col gap-2'>
        <h3 className="uppercase text-xs font-semibold text-gray-400 tracking-wider mb-2">
          {type === 'member' ? '個人選單' : '管理控制台'}
        </h3>
        {menus.map((item) => {
          const isActive = activeMenu === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onMenuChange(item.label)}
              // 3. 活躍/預設樣式調整
              className={`
                flex items-center gap-4 w-full text-left cursor-pointer py-3 px-4 rounded-xl transition-all duration-200 
                ${isActive
                  // 活躍樣式：主色調背景，白色文字，輕微陰影
                  ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/50'
                  // 預設/懸停樣式：更深的文字，懸停時主色調背景
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium'
                }
              `}
            >
              {/* 4. Icon 容器：調整樣式以適應 SVG */}
              <span className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-600'}`}>
                {item.icon}
              </span>
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
