'use client';

import { useModal } from '@/context/ModalContext';
import Image from 'next/image';

export default function PasswordSentModal() {
  const { isPasswordSentOpen, closePasswordSent } = useModal();

  if (!isPasswordSentOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative shadow-lg">
        {/* 關閉按鈕 */}
        <button
          onClick={closePasswordSent}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-xl cursor-pointer"
        >
          ×
        </button>

        {/* LOGO + 標題 */}
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo/logoColor.png" alt="LOGO" width={130} height={45} />
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            已發送密碼重置信件
          </h2>
        </div>

        {/* 了解按鈕 */}
        <button
          onClick={closePasswordSent}
          className="mt-6 w-full bg-[#EF9D11] text-white py-2 rounded-lg hover:bg-[#d9890e] transition-colors cursor-pointer"
        >
          了解
        </button>
      </div>
    </div>
  );
}
