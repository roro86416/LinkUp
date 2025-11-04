'use client';

// ⭐️ 替換：從 Heroicons 套件匯入圖標
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';

import React, { useState } from 'react';
// ⚠️ 注意：移除了 `SVGProps` 和所有手動定義的 SVG 組件，
// 因為 Heroicons 已經為它們提供了正確的 TypeScript 類型。

// --------------------- 顏色與樣式變數 ---------------------
const primaryColor = '#1976D2'; // 經典藍 (不變)
const primaryBgColor = 'bg-blue-600'; // (不變)
const primaryTextColor = 'text-blue-700'; // (不變)

// --------------------- 模擬數據 ---------------------
const transactions = [
  { id: 'T2025001', date: '2025/11/01', activity: '年度峰會報名', amount: 1500, status: '完成', method: '信用卡', user: '王小明' },
  { id: 'T2025002', date: '2025/10/30', activity: '線上課程訂閱', amount: 299, status: '完成', method: 'LINE Pay', user: '陳大華' },
  { id: 'T2025003', date: '2025/10/28', activity: 'VIP 會員升級', amount: 9999, status: '處理中', method: 'ATM 轉帳', user: '林佳玲' },
  { id: 'T2025004', date: '2025/10/25', activity: '研討會門票', amount: 650, status: '完成', method: '信用卡', user: '許文豪' },
  { id: 'T2025005', date: '2025/10/20', activity: '新手入門套件', amount: 49, status: '取消', method: 'PayPal', user: '郭美慧' },
  { id: 'T2025006', date: '2025/10/18', activity: '月度報告購買', amount: 199, status: '完成', method: '信用卡', user: '鄭志偉' },
  { id: 'T2025007', date: '2025/10/15', activity: '年度峰會報名', amount: 1500, status: '完成', method: 'ATM 轉帳', user: '劉雅琪' },
  { id: 'T2025008', date: '2025/10/12', activity: '技術文件下載', amount: 350, status: '處理中', method: 'LINE Pay', user: '張君雅' },
];

// --------------------- 狀態徽章組件 ---------------------
// 保持 StatusBadge props 介面不變，這是您自定義的組件類型。
interface StatusBadgeProps {
  status: '完成' | '處理中' | '取消' | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClass = 'bg-gray-200 text-gray-800';
  switch (status) {
    case '完成':
      colorClass = 'bg-green-100 text-green-700';
      break;
    case '處理中':
      colorClass = 'bg-yellow-100 text-yellow-700';
      break;
    case '取消':
      colorClass = 'bg-red-100 text-red-700';
      break;
  }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
};


export default function TransactionManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // 每頁顯示數量
  const totalPages = Math.ceil(transactions.length / pageSize);

  // 計算當前頁面數據
  const currentData = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    // 外部容器：無間距，無背景
    <div className="w-full mx-auto">

      <h1 className={`text-2xl font-bold ${primaryTextColor}`}>
        交易紀錄管理
      </h1>

      <div className="mt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* 搜尋欄 */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="搜尋交易 ID、活動或使用者..."
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
          {/* ⭐️ 使用 Heroicon: MagnifyingGlassIcon */}
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* 篩選按鈕 */}
        <div className="flex space-x-3">
          <button className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150`}>
            {/* ⭐️ 使用 Heroicon: AdjustmentsHorizontalIcon */}
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            <span>進階篩選</span>
          </button>
          <button className={`px-4 py-2 rounded-lg text-white ${primaryBgColor} hover:bg-blue-700 transition duration-150`}>
            匯出 CSV
          </button>
        </div>
      </div>


      {/* 核心交易表格 (內部有 padding 和白色背景) */}
      <div className="p-6 overflow-x-auto bg-white">
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className={`bg-gray-50`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-700 transition duration-150">
                交易 ID
                {/* ⭐️ 使用 Heroicon: ArrowDownIcon */}
                <ArrowDownIcon className="inline ml-1 h-3 w-3" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                交易日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                關聯活動
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                交易者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                交易方式
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額 (NT$)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((tx) => (
              <tr key={tx.id} className="hover:bg-blue-50/50 transition duration-150">
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${primaryTextColor}`}>
                  {tx.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tx.activity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tx.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁控制 (內部有 padding 和白色背景) */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          {/* 手機版導航 */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 disabled:opacity-50`}
          >
            上一頁
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 disabled:opacity-50`}
          >
            下一頁
          </button>
        </div>

        {/* 桌面版分頁 */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              顯示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
              到 <span className="font-medium">{Math.min(currentPage * pageSize, transactions.length)}</span>
              筆，共 <span className="font-medium">{transactions.length}</span> 筆結果
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                {/* ⭐️ 使用 Heroicon: ChevronLeftIcon */}
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* 範例簡化分頁 - 實際應用中需動態生成頁碼 */}
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                {/* ⭐️ 使用 Heroicon: ChevronRightIcon */}
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>

    </div>
  );
}