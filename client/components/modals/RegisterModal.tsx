'use client';
import { useModal } from '../../context/ModalContext';
import { useState } from 'react';
import Image from 'next/image';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// ✅ 直接放入這裡的 registerUser function
async function registerUser(email: string, password: string, name?: string) {
  const res = await fetch('http://localhost:3001/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || '註冊失敗');
  }

  return res.json();
}

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister, openEmailLogin } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isRegisterOpen) return null;

  const handleRegister = async () => {
    if (!agree) {
      setMessage('⚠️ 請先勾選同意條款');
      return;
    }
    if (!email || !password) {
      setMessage('⚠️ 請填寫完整資訊');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await registerUser(email, password);
      console.log('✅ 註冊成功:', result);
      setMessage('🎉 註冊成功！');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        closeRegister();
        openEmailLogin();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage('❌ 發生未知錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative shadow-lg">
        <button
          onClick={closeRegister}
          className="absolute right-4 top-4 text-gray-400 hover:text-black text-xl cursor-pointer"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          <Image src="/logo/logoColor.png" alt="LOGO" width={130} height={45} />
          <h2 className="text-2xl font-bold text-gray-800 text-center mt-4 mb-4">免費註冊</h2>
        </div>

        <input
          type="email"
          placeholder="電子郵件"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF9D11] text-gray-800 placeholder-gray-500"
        />

        <div className="relative w-full mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="密碼 (至少8碼)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#EF9D11]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </button>
        </div>

        <label className="flex items-center gap-2 mb-4 text-gray-700 text-sm select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-[#EF9D11] cursor-pointer"
            />
            <svg
              className="absolute left-0 top-0 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          我已詳細並同意{' '}
          <span className="text-[#EF9D11] cursor-pointer">使用者條款</span> &
          <span className="text-[#EF9D11] cursor-pointer">隱私權保護政策</span>
        </label>

        <button
          onClick={handleRegister}
          disabled={!agree || loading}
          className={`w-full py-2 rounded-lg transition-colors cursor-pointer ${agree ? 'bg-[#EF9D11] hover:bg-[#d9890e] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
        >
          {loading ? '註冊中...' : '註冊'}
        </button>

        {message && (
          <p className="text-center text-sm mt-3 text-gray-700 whitespace-pre-wrap">{message}</p>
        )}

        <p className="text-center text-sm text-gray-700 mt-4">
          已成為會員？{' '}
          <span
            onClick={() => {
              closeRegister();
              openEmailLogin();
            }}
            className="text-[#658AD0] hover:underline cursor-pointer"
          >
            立即登入！
          </span>
        </p>
      </div>
    </div>
  );
}
