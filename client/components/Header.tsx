'use client';

import Link from 'next/link';
import { useModal } from '../context/ModalContext';
import Image from 'next/image';
// ⭐️ 修正：從 react-icons/fa 匯入 FaTicketAlt (票券圖標)
import { FaTicketAlt } from 'react-icons/fa';

export default function Header() {
  const { openLogin } = useModal();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-1 bg-black/50 backdrop-blur-md shadow-md"
    >
      {/* ✅ 用 Link 包住 logo */}
      <Link href="/" className="cursor-pointer">
        <Image
          src="/logo/logoBlack.png"
          alt="LOGO"
          width={120}
          height={40}
          className="invert brightness-200"
        />
      </Link>

      <div className="flex gap-4 items-center">
        {/* ⭐️ 修正：將「購物車」替換為「我的票卷」，並使用 FaTicketAlt 圖標 */}
        <button className="flex items-center gap-2 text-white hover:text-[#EF9D11] font-medium transition-colors px-4 py-2 cursor-pointer">
          <FaTicketAlt className="text-lg" /> 我的票卷
        </button>
        <button
          onClick={openLogin}
          className="flex items-center gap-2 text-white hover:text-[#EF9D11] font-medium transition-colors px-4 py-2 cursor-pointer"
        >
          登入 / 註冊
        </button>
      </div>
    </header>
  );
}