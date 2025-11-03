import { useState, ChangeEvent } from "react";
// 為了避免環境依賴，我將移除對 `sonner` 的引用，改用 console.log 模擬通知。
// import { toast } from "sonner"; 

// ⭐️ 修正：匯入 Heroicons 的線條風格圖標
import {
  EnvelopeIcon // 用於替換 Email SVG
} from '@heroicons/react/24/outline';

// 由於移除了 Tabs 元件，我們需要一個簡單的選項列表
type TabType = "基本資料" | "帳號安全" | "登入方式";

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  email: string;
}

// 主 App 元件
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("基本資料");

  // 帳號安全 Tab 所需的狀態
  const [isVerified, setIsVerified] = useState(true); // 為了展示效果，將預設改為已驗證
  const userEmail = "upu06126@laoia.com"; // 模擬用戶郵箱

  const [formData, setFormData] = useState<FormData>({
    firstName: "大明",
    lastName: "李",
    gender: "男",
    birthDate: "1990-01-01",
    country: "台灣",
    phoneCode: "+886",
    phoneNumber: "0912345678",
    email: userEmail,
  });

  // 模擬第三方帳號綁定狀態
  const [providerStatus, setProviderStatus] = useState({
    Facebook: true, // 模擬已綁定
    Google: false,  // 模擬未綁定
  });


  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (tabName: string) => {
    console.log(`[${tabName}]: 資料已儲存成功！`, formData);
    // toast.success("資料已儲存成功！");
  };

  // 帳號安全 - 重新發送驗證信函
  const handleResendVerification = () => {
    console.log("重新發送驗證信...");
    // 實際應用中，這裡會調用 API
    // 模擬重新發送後狀態
    // toast.info("驗證信已重新發送！");
  };

  // 帳號安全 - 刪除會員
  const handleDeleteAccount = () => {
    // 實際應用中，會彈出一個確認 modal
    console.log("嘗試刪除會員...");
    // toast.error("已發起會員刪除流程...");
  };

  // 登入方式 - 處理綁定/解除綁定
  const handleBind = (provider: keyof typeof providerStatus, isCurrentlyBound: boolean) => {
    console.log(`嘗試 ${isCurrentlyBound ? '解除' : ''}綁定 ${provider}`);
    // 模擬狀態切換
    setProviderStatus(prev => ({ ...prev, [provider]: !isCurrentlyBound }));
    // toast.success(`${provider} 已${isCurrentlyBound ? '解除' : ''}綁定！`);
  };

  // 處理原生 <select> 的 ChangeEvent
  const handleSelectChange = (field: keyof FormData) => (e: ChangeEvent<HTMLSelectElement>) => {
    updateField(field, e.target.value);
  };

  // 渲染 Tab 內容
  const renderTabContent = (tab: TabType) => {
    // 共用樣式類別：
    // 注意: h-10 讓輸入框高度固定
    const labelClasses = "before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-gray-600 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-300 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-300 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-gray-600 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500";
    const inputFieldClasses = "peer w-full h-full bg-white text-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-gray-100 disabled:border-0 transition-all border text-base px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-indigo-500";


    if (tab === "基本資料") {
      return (
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200">個人資訊</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">

            <label className="relative w-full min-w-[200px] h-12">
              <input
                type="text"
                className={inputFieldClasses + " h-full"}
                placeholder=" "
                value={formData.firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("firstName", e.target.value)}
              />
              <span className={labelClasses}>
                名 *
              </span>
            </label>

            <label className="relative w-full min-w-[200px] h-12">
              <input
                type="text"
                className={inputFieldClasses + " h-full"}
                placeholder=" "
                value={formData.lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("lastName", e.target.value)}
              />
              <span className={labelClasses}>
                姓 *
              </span>
            </label>

            <div className="relative h-12 w-full min-w-[200px]">
              <select
                className={inputFieldClasses + " h-full appearance-none"}
                value={formData.gender}
                onChange={handleSelectChange("gender")}
              >
                <option value="" disabled>請選擇</option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他">其他</option>
              </select>
              <label className={labelClasses}>
                性別
              </label>
            </div>

            <label className="relative w-full min-w-[200px] h-12">
              <input
                type="date"
                className={inputFieldClasses + " h-full"}
                placeholder=" "
                value={formData.birthDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("birthDate", e.target.value)}
              />
              <span className={labelClasses}>
                出生日期
              </span>
            </label>

            <div className="relative h-12 w-full min-w-[200px]">
              <select
                className={inputFieldClasses + " h-full appearance-none"}
                value={formData.country}
                onChange={handleSelectChange("country")}
              >
                <option value="" disabled>請選擇</option>
                <option value="台灣">台灣</option>
                <option value="中國">中國</option>
                <option value="日本">日本</option>
                <option value="韓國">韓國</option>
                <option value="美國">美國</option>
                <option value="其他">其他</option>
              </select>
              <label className={labelClasses}>
                國家/地區
              </label>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200 mt-10">聯絡資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
            <div className="flex gap-3">
              <div className="relative h-12 w-32 min-w-[120px]">
                <select
                  className={inputFieldClasses + " h-full appearance-none"}
                  value={formData.phoneCode}
                  onChange={handleSelectChange("phoneCode")}
                >
                  <option value="+886">+886 (台灣)</option>
                  <option value="+86">+86 (中國)</option>
                  <option value="+81">+81 (日本)</option>
                  <option value="+82">+82 (韓國)</option>
                  <option value="+1">+1 (美國/加拿大)</option>
                </select>
                <label className={labelClasses}>
                  國碼
                </label>
              </div>

              <label className="relative w-full min-w-[200px] h-12">
                <input
                  type="text"
                  className={inputFieldClasses + " h-full"}
                  placeholder=" "
                  value={formData.phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("phoneNumber", e.target.value)}
                />
                <span className={labelClasses}>
                  電話號碼
                </span>
              </label>
            </div>

            <label className="relative w-full min-w-[200px] h-12">
              <input
                type="email"
                className={inputFieldClasses + " h-full"}
                placeholder=" "
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("email", e.target.value)}
                disabled
              />
              <span className={labelClasses}>
                聯絡 E-mail
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 mt-10">
            <button
              type="button"
              className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-150 ease-in-out text-base"
              onClick={() => handleSave('基本資料')}
            >
              儲存變更
            </button>
          </div>
        </div>
      );
    }

    if (tab === "帳號安全") {
      return (
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200">管理密碼與帳號狀態</h3>

          <div className="space-y-12">

            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm"> {/* 保留區塊背景 */}
              <h4 className="text-lg font-semibold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-3">
                更改密碼
              </h4>

              <form className="space-y-6 max-w-md">

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    原密碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="請輸入原密碼"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    新密碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="請輸入新密碼"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    再次確認新密碼
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次確認新密碼"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white"
                  />
                </div>

                <div className="pt-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleSave('更改密碼')}
                    className="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-300 text-base"
                  >
                    儲存新密碼
                  </button>
                </div>
              </form>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm"> {/* 保留區塊背景 */}
              <h4 className="text-lg font-semibold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-3">
                驗證登入信箱
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-lg border border-gray-300 bg-white shadow-sm"> {/* 保留資訊卡片背景 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4 sm:mb-0">
                  <p className="text-gray-700 font-mono text-base break-all">{userEmail}</p>
                  <span
                    className={`text-xs font-semibold py-1.5 px-3 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {isVerified ? '✓ 已驗證' : '✗ 尚未驗證'}
                  </span>
                </div>
                {!isVerified && (
                  <button
                    onClick={handleResendVerification}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition duration-150 disabled:opacity-50 w-full sm:w-auto text-center py-2 px-4 rounded-lg border border-indigo-300"
                    disabled={!userEmail}
                  >
                    重新發送驗證信
                  </button>
                )}
                {isVerified && (
                  <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-right">
                    您的郵箱已安全驗證。
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-red-600 bg-red-50/50 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 border-l-4 border-red-600 pl-3">
                刪除會員
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-lg border border-red-300 bg-white shadow-sm"> {/* 保留資訊卡片背景 */}
                <p className="text-gray-700 mb-4 sm:mb-0 text-base">
                  永久刪除帳號 <span className="font-mono font-semibold break-all text-red-700">{userEmail}</span>
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-300 w-full sm:w-auto text-base"
                >
                  刪除會員
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    // 登入方式 Tab 內容 (已修正為 const)
    return (
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-8 border-b pb-4 border-gray-200">登入方式管理</h3>

        <div className="space-y-12">

          <div className="mb-12">
            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-gray-400 pl-3">
              電子郵件
            </h4>
            <div className="p-5 rounded-xl border border-gray-200 max-w-lg bg-white shadow-md"> {/* 保留資訊卡片背景 */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-100 rounded-xl shrink-0 mt-0.5"> {/* 保留 Email Icon 背景 */}
                  {/* ⭐️ 修正：替換為 EnvelopeIcon */}
                  <EnvelopeIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">主要登入方式</p>
                  <p className="text-lg font-semibold text-gray-800 break-all">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-6 border-l-4 border-gray-400 pl-3">
              第三方帳號綁定
            </h4>

            <div className="space-y-6 max-w-lg">
              {Object.entries(providerStatus).map(([name, isBound]) => {

                // ⭐️ 修正：使用 const 和三元運算子取代 let 和 if/else 結構
                const isFacebook = name === 'Facebook';
                const isGoogle = name === 'Google';

                const logoContent: React.ReactNode = isFacebook
                  ? <img src="/icon-login/facebook.png" alt="Facebook Logo" className="w-8 h-8 object-contain" />
                  : isGoogle
                    ? <img src="/icon-login/google.png" alt="Google Logo" className="w-8 h-8 object-contain" />
                    : null;

                const logoBgClass = 'bg-transparent'; // 由於都是圖片，直接設定即可
                const providerDisplay = name; // 永遠等於 name

                return (
                  <div
                    key={name}
                    className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      {/* ⭐️ 修正：動態顯示圖片 */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${logoBgClass} shadow-md`}>
                        {logoContent}
                      </div>
                      <p className="text-lg font-medium text-gray-800">{providerDisplay}</p>
                    </div>

                    {isBound ? (
                      <button
                        onClick={() => handleBind(name as keyof typeof providerStatus, isBound)}
                        className="py-2.5 px-6 rounded-xl text-base font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition duration-150 shadow-sm"
                      >
                        解除綁定
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBind(name as keyof typeof providerStatus, isBound)}
                        className="py-2.5 px-6 rounded-xl text-base font-medium border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition duration-150 shadow-sm"
                      >
                        綁定
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // 外部容器：完全移除所有背景色、邊框和陰影，只保留內間距和最大寬度，讓它融入現有 layout。
    <div className="w-full mx-auto">


      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
        帳號設定
      </h2>
      <p className="text-gray-500">
        管理您的個人資訊、保障帳號安全，並設定或解除綁定常用的登入方式。請務必確保資料的準確性與安全性。
      </p>


      {/* Tab 選項卡區域 */}
      <div className="flex border-b border-gray-300 mt-6">
        {["基本資料", "帳號安全", "登入方式"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`py-3 px-5 text-base font-semibold transition duration-200 border-b-2 
    ${activeTab === tab
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-300"
              } -mb-px focus:outline-none whitespace-nowrap`}
          >
            {tab}
          </button>

        ))}
      </div>

      <div className="w-full">
        {renderTabContent(activeTab)}
      </div>
    </div >
  );
}