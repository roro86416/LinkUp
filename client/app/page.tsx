'use client';
import { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
// ⭐️ 修正：替換所有 react-icons，改用 Heroicons
import {
  MagnifyingGlassIcon, // 替代 AiOutlineSearch
  ChevronDownIcon as HiChevronDown, // 替代 HiChevronDown
  PaintBrushIcon, // 替代 FaPaintBrush
  CodeBracketIcon, // 替代 FaLaptopCode (用於科技/程式碼)
  BriefcaseIcon, // 替代 FaBriefcase
  MusicalNoteIcon, // 替代 FaMusic
  BoltIcon, // 替代 FaRunning (用閃電代表速度/運動)
  BookOpenIcon, // 替代 FaTicketAlt (用於查看文章)
} from '@heroicons/react/24/outline'; // 匯入 Heroicons 的線條風格圖標

// Login Modal
function LoginModal({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white/30 backdrop-blur-md rounded-xl w-96 p-6 shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">登入</h2>
        <input
          type="text"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm"
        />
        <input
          type="password"
          placeholder="密碼"
          className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm"
        />
        <button className="w-full bg-[#658AD0] hover:bg-[#5a7ab8] text-white py-2 rounded-md transition-colors mb-3">
          登入
        </button>
        <div className="text-center text-sm text-gray-900">
          還未註冊嗎？{' '}
          <span className="text-[#658AD0] hover:text-[#5a7ab8] cursor-pointer font-medium" onClick={onSwitch}>
            請註冊
          </span>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Register Modal
function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white/30 backdrop-blur-md rounded-xl w-96 p-6 shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">註冊</h2>
        <input type="text" placeholder="Email" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
        <input type="password" placeholder="密碼" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
        <input type="password" placeholder="確認密碼" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors">
          註冊
        </button>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// HomePage
export default function HomePage() {
  const [location, setLocation] = useState('台北市');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const locations = ['台北市', '新北市', '台中市', '台南市', '高雄市'];

  const categories = [
    { name: '藝術', icon: <PaintBrushIcon className="w-6 h-6" /> }, // ⭐️ 替換圖標
    { name: '科技', icon: <CodeBracketIcon className="w-6 h-6" /> }, // ⭐️ 替換圖標
    { name: '商業', icon: <BriefcaseIcon className="w-6 h-6" /> }, // ⭐️ 替換圖標
    { name: '音樂', icon: <MusicalNoteIcon className="w-6 h-6" /> }, // ⭐️ 替換圖標
    { name: '運動', icon: <BoltIcon className="w-6 h-6" /> }, // ⭐️ 替換圖標
  ];

  const events = [
    { id: 1, title: '創業者交流夜', date: 'Oct 20, 2025', desc: '與創業者互相交流經驗，探討創業過程中的挑戰與機會，並建立人脈網絡。', img: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'AI 科技論壇', date: 'Oct 21, 2025', desc: '探索人工智慧最新趨勢，了解AI在各行各業的應用與發展方向。', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: '設計思維工作坊', date: 'Oct 22, 2025', desc: '動手實作設計思維案例，學習如何以用戶為中心進行產品設計與創新。', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: '音樂創作夜', date: 'Oct 23, 2025', desc: '與音樂人一起創作音樂，分享創作技巧並體驗音樂合作的樂趣。', img: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80' },
  ];

  const bannerImages = [
    'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80',
    'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen text-gray-900 bg-white overflow-x-hidden">
      {/* Banner */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img src={bannerImages[currentSlide]} alt="banner" className="w-full h-full object-cover" />


        {/* 搜尋欄 + 按鈕 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 gap-4">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="搜尋活動"
              className="w-full pl-10 pr-3 py-3 rounded-lg bg-black/20 text-white placeholder-white text-center hover:bg-black/30 focus:outline-none focus:ring-0 border border-white transition-all duration-200 cursor-pointer"
            />
            {/* ⭐️ 替換圖標 */}
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
          {/* ⭐️ 移除「舉辦活動」和「我的票卷」按鈕 */}
          <div className="flex gap-2 flex-wrap justify-center">
            {/* <button className="..."> <FaBriefcase className="text-lg" /> 舉辦活動 </button> */}
            {/* <button className="..."> <FaTicketAlt className="text-lg" /> 我的票卷 </button> */}
          </div>
        </div>

        {/* 左右箭頭 (保持不變) */}
        <div
          className="absolute inset-y-0 left-4 flex items-center z-50 cursor-pointer"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
        >
          <span className="text-white text-3xl select-none drop-shadow-md">‹</span>
        </div>
        <div
          className="absolute inset-y-0 right-4 flex items-center z-50 cursor-pointer"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}
        >
          <span className="text-white text-3xl select-none drop-shadow-md">›</span>
        </div>
      </section>

      {/* 類別按鈕 */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-14">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button className="w-20 h-20 rounded-full border border-gray-300 text-gray-900 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#EF9D11] hover:text-[#EF9D11] cursor-pointer bg-white">
                {/* ⭐️ 圖標已在 categories 陣列中替換 */}
                {cat.icon}
              </button>
              <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 熱門活動卡片 */}
      <div className="px-16 py-8 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          熱門活動
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-56 object-cover"
              />
              {/* 文字區 */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white bg-black/30">
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-base mt-1">{event.date}</p>
                <p className="text-sm mt-2">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 生活日誌精選 */}
      <section
        className="relative text-white py-20 px-8 bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div> {/* 輕微暗色增加可讀性 */}

        <div className="relative max-w-3xl text-left z-10">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">生活日誌</h2>

          <h3 className="text-3xl font-semibold mb-4">今日精選：城市漫步</h3>
          <p className="text-lg mb-6 leading-relaxed">
            城市的每個角落都隱藏著故事，從老街的咖啡香氣到河畔的微風，每一步都能感受到生活的溫度。跟隨步伐，慢慢走過不一樣的街道，聆聽人們的笑聲與交談，偶爾停下來看看街頭藝人的表演，或是在小巷的書店裡翻閱一本書，這些看似平凡的瞬間，卻能讓心靈得到滿足。用心觀察身邊的細節，你會發現城市也能像一本厚重的日誌，記錄著每個人的故事與情感。
          </p>
          <button className="flex items-center gap-2 text-white hover:text-[#EF9D11] font-medium transition-colors px-5 py-3 border border-white rounded-lg shadow-lg cursor-pointer bg-black/20 backdrop-blur-md">
            {/* ⭐️ 替換為 BookOpenIcon */}
            <BookOpenIcon className="w-5 h-5" /> 查看更多文章
          </button>
        </div>
      </section>



      <div className="px-16 py-12 bg-white">
        {/* 標題 + 下拉選單 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <span className="font-semibold text-gray-900 text-lg">瀏覽活動</span>

          <Listbox value={location} onChange={setLocation}>
            <div className="relative w-32">
              <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white/50 backdrop-blur-sm py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm border border-gray-300 hover:bg-white/70 transition-colors">
                {location}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {/* ⭐️ 替換圖標 */}
                  <HiChevronDown className="h-5 w-5 text-gray-700" />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/70 backdrop-blur-sm py-1 text-base shadow-lg focus:outline-none z-[9999]">
                  {locations.map((loc, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 pl-3 pr-9 transition-all duration-200
                  ${selected ? 'bg-[#658AD0] text-white' : active ? 'bg-[#658AD0]/50 text-white' : 'text-gray-900'}`
                      }
                      value={loc}
                    >
                      {loc}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* 活動列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <img src={event.img} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-700">{event.date}</p>
                <p className="text-sm text-gray-800">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}