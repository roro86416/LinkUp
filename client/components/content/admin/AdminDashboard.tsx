'use client';

import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// ⭐️ 修正：匯入 Heroicons 的線條風格圖標
import {
  UsersIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // --------------------- 統一顏色變數 (新主題：經典藍/亮橙) ---------------------
  // 主色調：藍色 (用於使用者、總覽、表格)
  const primaryColor = '#1976D2'; // 經典藍
  const primaryBgColor = 'rgba(25, 118, 210, 0.15)';
  const primaryHoverColor = '#1565C0';

  // 次要/強調色調：橙色 (用於交易額、報名人數)
  const secondaryColor = '#C07AB8';
  const secondaryBgColor = 'rgba(255, 152, 0, 0.15)';
  const secondaryHoverColor = '#6C3365';

  // 圓餅圖顏色 (藍橙搭配)
  const pieColors = ['#484891', '#7373B9', '	#A6A6D2', '#D8D8EB'];


  // --------------------- 圖表資料 (保持不變) ---------------------
  const pieData = {
    labels: ['活動 A', '活動 B', '活動 C', '活動 D'],
    datasets: [
      {
        data: [30, 20, 25, 25],
        backgroundColor: pieColors,
        hoverOffset: 10,
      },
    ],
  };

  const lineDataUser = {
    labels: ['8月', '9月', '10月'],
    datasets: [
      {
        label: '使用者數量',
        data: [1200, 1300, 1500],
        // 使用主色調 (經典藍)
        borderColor: primaryColor,
        backgroundColor: primaryBgColor,
        tension: 0.4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: primaryHoverColor,
        fill: true,
      },
    ],
  };

  const lineDataRevenue = {
    labels: ['8月', '9月', '10月'],
    datasets: [
      {
        label: '交易額',
        data: [20000, 25000, 30000],
        // 使用次要色調 (亮橙色)
        borderColor: secondaryColor,
        backgroundColor: secondaryBgColor,
        tension: 0.4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: secondaryHoverColor,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['8月', '9月', '10月'],
    datasets: [
      {
        label: '報名人數',
        data: [200, 250, 300],
        // 使用次要色調 (亮橙色)
        backgroundColor: secondaryColor,
        hoverBackgroundColor: secondaryHoverColor,
      },
    ],
  };

  // --------------------- 圖表選項 (保持不變) ---------------------
  const pieOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutBounce',
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  // --------------------- 當月熱門活動 (保持不變) ---------------------
  const hotActivities = [
    { name: '真時光', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 150, status: '進行中' },
    { name: '未來課堂', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 120, status: '報名中' },
    { name: '足跡地圖', organizer: 'Microsoft', date: '2025/10/20', email: 'jane@microsoft.com', count: 85, status: '進行中' },
  ];

  return (
    <div className="w-full mx-auto">
      {/* ---------------- 匯出按鈕 ---------------- */}
      <div className="flex justify-end mb-4">
        {/* ⭐️ 修正：替換 SVG 圖標，使用 Heroicon */}
        <span className="flex items-center gap-1 text-blue-700 cursor-pointer font-semibold hover:text-blue-500 transition-colors">
          <ArrowDownTrayIcon className="w-5 h-5" /> 匯出報表
        </span>
      </div>

      {/* ---------------- KPI 卡片 ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 總使用人數 (使用主色調：藍) */}
        <div className="bg-blue-50 rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-2 border border-blue-400 rounded">
            {/* ⭐️ 修正：替換為 UsersIcon */}
            <UsersIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">總使用人數</h3>
            <p className="text-gray-900 font-bold text-2xl mt-1">1,500</p>
          </div>
        </div>

        {/* 當月活動總數 (使用主色調：藍) */}
        <div className="bg-blue-50 rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-2 border border-blue-400 rounded">
            {/* ⭐️ 修正：替換為 CalendarDaysIcon */}
            <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">當月活動總數</h3>
            <p className="text-gray-900 font-bold text-2xl mt-1">45</p>
          </div>
        </div>

        {/* 當月交易額 (使用次要色調：橙) */}
        <div className="bg-orange-50 rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-2 border border-orange-400 rounded">
            {/* ⭐️ 修正：替換為 BanknotesIcon */}
            <BanknotesIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">當月交易額</h3>
            <p className="text-gray-900 font-bold text-2xl mt-1">$30,000</p>
          </div>
        </div>
      </div>

      {/* ---------------- 圖表區 (保持不變) ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h3 className="text-gray-900 font-semibold mb-4">使用者成長趨勢</h3>
          <Line data={lineDataUser} options={lineOptions} />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h3 className="text-gray-900 font-semibold mb-4">交易額走勢 (近三個月)</h3>
          <Line data={lineDataRevenue} options={lineOptions} />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-900 font-semibold mb-4">活動分類分布 (近三個月)</h3>
          <div className="w-2/3 mx-auto">
            <Doughnut data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-900 font-semibold mb-4">報名趨勢</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* ---------------- 當月熱門活動表格 (保持不變) ---------------- */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-gray-900 font-semibold mb-4">當月熱門活動</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-[#7373B9] text-white">
                <th className="p-2">活動名稱</th>
                <th className="p-2">主辦方</th>
                <th className="p-2">建立日期</th>
                <th className="p-2">E-mail</th>
                <th className="p-2">報名人數</th>
                <th className="p-2">狀態</th>
              </tr>
            </thead>
            <tbody>
              {hotActivities.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-100 cursor-pointer">
                  <td className="p-2 text-gray-900">{item.name}</td>
                  <td className="p-2 text-gray-900">{item.organizer}</td>
                  <td className="p-2 text-gray-900">{item.date}</td>
                  <td className="p-2 text-gray-900">{item.email}</td>
                  <td className="p-2 text-gray-900">{item.count}</td>
                  <td className="p-2 text-gray-900">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}