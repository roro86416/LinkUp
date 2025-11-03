'use client';

import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';

// 會員內容頁面
import AccountSettings from '@/components/content/member/AccountSettings';
import Messages from '@/components/content/member/Messages';
import Favorites from '@/components/content/member/Favorites';

// 管理員內容頁面
import AdminDashboard from '@/components/content/admin/AdminDashboard';
import AdminUsers from '@/components/content/admin/AdminUsers';

import AdminTransaction from '@/components/content/admin/AdminTransaction';

import AdminAnnouncements from '@/components/content/admin/AdminAnnouncements';

interface UserLayoutProps {
  type: 'member' | 'admin';
  children?: React.ReactNode; // ✅ 加這一行
}

export default function UserLayout({ type }: UserLayoutProps) {
  const [activeMenu, setActiveMenu] = useState(
    type === 'member' ? '帳號設定' : '後台總覽'
  );

  const renderContent = (): ReactNode => {
    if (type === 'member') {
      switch (activeMenu) {
        case '帳號設定':
          return <AccountSettings />;
        case '訊息管理':
          return <Messages />;
        case '我的收藏':
          return <Favorites />;
        default:
          return <div>請選擇一個頁面</div>;
      }
    } else {
      switch (activeMenu) {
        case '後台總覽':
          return <AdminDashboard />;
        case '會員管理':
          return <AdminUsers />;
        case '交易管理':
          return <AdminTransaction />;
        case '系統公告管理':
          return <AdminAnnouncements />;
        default:
          return <div>請選擇一個頁面</div>;
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5] flex gap-6 min-h-screen p-12 justify-center">
      <Sidebar
        type={type}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
      />

      <div className="bg-white rounded-md p-6 w-[952px]">
        {renderContent()}
      </div>
    </div>
  );
}
