'use client';

import { useModal } from '../../context/ModalContext';
import { useState } from 'react';
import Image from 'next/image';

export default function ForgotPasswordModal() {
  const { isForgotPasswordOpen, closeForgotPassword, openRegister, openPasswordSent } = useModal();
  const [email, setEmail] = useState('');

  if (!isForgotPasswordOpen) return null;

  const handleOpenRegister = () => {
    closeForgotPassword();
    openRegister();
  };

  const handleResetPassword = () => {
    console.log('重設密碼請求', email);
    closeForgotPassword();
    openPasswordSent(); // ✅ 確保這個方法存在於 ModalContext
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative shadow-lg">
        {/* 關閉按鈕 */}
        <button
          onClick={closeForgotPassword}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-xl cursor-pointer"
        >
          ×
        </button>

        {/* LOGO + 標題 */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo/logoColor.png" alt="LOGO" width={130} height={45} />
          <h2 className="text-2xl font-bold text-gray-800 mt-4 text-center mb-2">忘記密碼</h2>
          <p className="text-gray-500 text-sm text-center">請輸入您的電子郵件來重設密碼</p>
        </div>

        {/* 電子郵件輸入 */}
        <input
          type="email"
          placeholder="電子郵件"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#658AD0]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 重新設定密碼按鈕 */}
        <button
          onClick={handleResetPassword}
          className="w-full bg-[#658AD0] text-white py-2 rounded-lg hover:bg-[#4f6eb1] transition-colors cursor-pointer"
        >
          重新設定密碼
        </button>

        {/* 註冊連結 */}
        <p className="text-center text-sm text-gray-700 mt-4">
          還未加入 LINKUP？{' '}
          <span onClick={handleOpenRegister} className="text-[#EF9D11] hover:underline cursor-pointer">
            立即註冊！
          </span>
        </p>
      </div>
    </div>
  );
}
