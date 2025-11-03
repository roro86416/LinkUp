'use client';
import { useModal } from '../../context/ModalContext';
import Image from 'next/image';

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openEmailLogin, openRegister } = useModal();
  if (!isLoginOpen) return null;

  // 包一個通用函式
  const handleClick = (action?: () => void) => {
    closeLogin();
    if (action) action();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[420px] relative shadow-lg">
        <button onClick={closeLogin} className="absolute right-4 top-4 text-gray-400 hover:text-black text-xl cursor-pointer">×</button>

        <div className="flex flex-col items-center gap-3 mb-6">
          <Image src="/logo/logoColor.png" alt="LOGO" width={130} height={45} />
          <h2 className="text-2xl font-bold text-gray-800">登入 / 註冊 LINKUP</h2>
          <p className="text-gray-500 text-sm text-center">立即登入！隨時收到獨家優惠</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleClick()}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            <Image src="/icon-login/facebook.png" alt="Facebook" width={20} height={20} />
            使用 Facebook 繼續
          </button>

          <button
            onClick={() => handleClick()}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            <Image src="/icon-login/google.png" alt="Google" width={20} height={20} />
            使用 Google 繼續
          </button>

          <button
            onClick={() => handleClick(openEmailLogin)}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <Image src="/icon-login/email.png" alt="Email" width={20} height={20} />
            使用 Email 繼續
          </button>
        </div>

        <p className="text-center text-sm text-gray-700 mt-6">
          還沒有帳號？{' '}
          <span
            onClick={() => handleClick(openRegister)}
            className="text-[#EF9D11] hover:underline cursor-pointer"
          >
            前往註冊
          </span>
        </p>
      </div>
    </div>
  );
}
