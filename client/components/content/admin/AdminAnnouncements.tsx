'use client';

import React, { useState } from 'react';
import {
  TrashIcon,
  ArrowsUpDownIcon,
  PhotoIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// --------------------- 類型定義 ---------------------
interface Banner {
  id: number;
  title: string;
  imageUrl: string; // 模擬圖片 URL
  linkUrl: string;
  isActive: boolean;
}

type BannerValue = Banner[keyof Banner];

// --------------------- 顏色與樣式變數 ---------------------
const primaryBgColor = 'bg-blue-600';
const primaryTextColor = 'text-blue-700';

// --------------------- 模擬資料 ---------------------
const initialBanners: Banner[] = [
  { id: 1, title: '年度活動盛大開啟', imageUrl: 'https://via.placeholder.com/800x200?text=Banner+1', linkUrl: '/event/annual', isActive: true },
  { id: 2, title: '線上課程優惠中', imageUrl: 'https://via.placeholder.com/800x200?text=Banner+2', linkUrl: '/courses/sale', isActive: true },
  { id: 3, title: '加入我們的VIP會員', imageUrl: '', linkUrl: '/join/vip', isActive: true },
];

// ... (BannerCard 組件保持不變) ...

interface BannerCardProps {
  banner: Banner;
  index: number;
  total: number;
  onUpdate: (index: number, key: keyof Banner, value: BannerValue) => void;
  onDelete: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  index,
  total,
  onUpdate,
  onDelete,
  onMove
}) => {

  // 模擬圖片上傳行為
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const mockUrl = URL.createObjectURL(e.target.files[0]);
      onUpdate(index, 'imageUrl', mockUrl);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-md bg-white p-5 transition duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4 border-b pb-3">
        <h3 className={`text-xl font-semibold ${primaryTextColor}`}>
          Banner {index + 1} / 3
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="上移"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="下移"
          >
            <ArrowDownIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(index)}
            disabled={total <= 1}
            className="p-1 rounded-md text-red-500 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="刪除"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">圖片預覽 (建議 4:1 比例)</label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden aspect-[4/1] flex items-center justify-center bg-gray-50">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title || "Banner 圖片"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-500">
                <PhotoIcon className="mx-auto h-8 w-8" />
                <p className="mt-1 text-sm">請上傳圖片</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="md:col-span-1 space-y-4">
          <div>
            <label htmlFor={`title-${banner.id}`} className="block text-sm font-medium text-gray-700">標題/說明</label>
            <input
              id={`title-${banner.id}`}
              type="text"
              value={banner.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              placeholder="輸入 Banner 標題"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor={`link-${banner.id}`} className="block text-sm font-medium text-gray-700">點擊連結 (URL)</label>
            <input
              id={`link-${banner.id}`}
              type="url"
              value={banner.linkUrl}
              onChange={(e) => onUpdate(index, 'linkUrl', e.target.value)}
              placeholder="例如: /products/new-item"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">
              是否啟用
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(e) => onUpdate(index, 'isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${primaryBgColor} peer-checked:bg-blue-600`}></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------- 主頁面組件 ---------------------

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  const handleUpdate = (index: number, key: keyof Banner, value: BannerValue) => {
    setBanners(prevBanners =>
      prevBanners.map((b, i) =>
        i === index ? { ...b, [key]: value } : b
      )
    );
  };

  const handleDelete = (indexToDelete: number) => {
    if (banners.length > 1) {
      setBanners(prevBanners => prevBanners.filter((_, i) => i !== indexToDelete));
    } else {
      alert("至少需要保留一張 Banner！");
    }
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= banners.length) return;

    const newBanners = [...banners];
    [newBanners[fromIndex], newBanners[toIndex]] = [newBanners[toIndex], newBanners[fromIndex]];
    setBanners(newBanners);
  };

  const handleAddBanner = () => {
    if (banners.length >= 3) {
      alert("最多只能設置 3 張 Banner！");
      return;
    }

    const newBanner: Banner = {
      id: Date.now(),
      title: '',
      imageUrl: '',
      linkUrl: '',
      isActive: false,
    };
    setBanners(prevBanners => [...prevBanners, newBanner]);
  };

  const handleSave = () => {
    console.log('Saved Banners Data:', banners);
    alert('Banner 變更已成功保存！');
  };

  return (
    // ⭐️ 修正：最外層只保留 w-full mx-auto
    <div className="w-full mx-auto min-h-screen">


      <div>
        <h1 className={`text-2xl font-bold ${primaryTextColor}`}>
          系統公告 (Banner) 管理
        </h1>
        <p className="text-gray-500 mt-1">
          設定首頁輪播的三張 Banner。請注意，輪播順序由卡片的排列順序決定。
        </p>
      </div>

      {/* Banner 編輯列表 */}
      {/* ⭐️ 修正：為列表添加一個容器以保持與標題區的對齊和間距 */}
      <div className="px-4 space-y-6 mb-8 mt-6">
        {banners.map((banner, index) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            index={index}
            total={banners.length}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        ))}
      </div>

      {/* 新增 Banner 按鈕 */}
      {banners.length < 3 && (
        <div className="flex justify-center mb-8 px-4">
          <button
            onClick={handleAddBanner}
            className={`flex items-center px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-150`}
          >
            + 新增 Banner ({banners.length} / 3)
          </button>
        </div>
      )}

      {/* 底部保存區 */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-xl z-10 flex flex-col md:flex-row-reverse md:justify-start items-center">
        <button
          onClick={handleSave}
          className={`w-full md:w-auto px-8 py-3 rounded-lg text-white font-semibold ${primaryBgColor} hover:bg-blue-700 transition duration-150 shadow-md order-1`}
        >
          儲存所有變更
        </button>
        <span className="mt-2 md:mt-0 md:mr-4 text-sm text-gray-500 order-2">
          變更後請點擊儲存，首頁將立即更新。
        </span>
      </div>
    </div>
  );
}