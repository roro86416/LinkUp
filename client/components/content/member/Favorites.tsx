import React, { useState, useMemo, useCallback } from 'react';

// ----------------------------------------------------
// 1. 類型定義 (Type Definitions)
// ----------------------------------------------------

interface FavoriteEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  isUpcoming: boolean;
  organizerName: string;
}

interface FavoriteOrganizer {
  id: number;
  name: string;
  category: string;
  followers: number;
  description: string;
}

type FavoriteTab = 'all' | 'events' | 'organizers';
type FavoriteItem = FavoriteEvent | FavoriteOrganizer;

// ✅ Type Guard：判斷是否為 FavoriteOrganizer
function isFavoriteOrganizer(item: FavoriteItem): item is FavoriteOrganizer {
  return 'name' in item && 'followers' in item;
}

// ----------------------------------------------------
// 2. 模擬資料
// ----------------------------------------------------

const initialFavoriteEvents: FavoriteEvent[] = [
  { id: 101, title: '2026 年前端開發趨勢論壇', date: '2026/03/15', location: '線上直播', isUpcoming: true, organizerName: 'Tech Innovators Co.' },
  { id: 102, title: 'Python 資料科學實戰營', date: '2025/11/20', location: '台北市信義區', isUpcoming: true, organizerName: 'Data Master' },
  { id: 103, title: '區塊鏈技術與應用入門', date: '2025/08/01', location: '台中市南屯區', isUpcoming: false, organizerName: 'Crypto World' },
];

const initialFavoriteOrganizers: FavoriteOrganizer[] = [
  { id: 201, name: 'Tech Innovators Co.', category: '科技', followers: 15200, description: '專注於最新的軟體開發與設計趨勢。' },
  { id: 202, name: 'Creative Arts Center', category: '藝術', followers: 8500, description: '提供多元化的藝術工作坊與展覽。' },
  { id: 203, name: 'Green Earth Foundation', category: '環保', followers: 23000, description: '致力於推動環境保護與永續發展。' },
];

// ----------------------------------------------------
// 3. 收藏活動卡片
// ----------------------------------------------------

interface EventCardProps {
  event: FavoriteEvent;
  onRemove: (id: number, title: string) => void;
}

const FavoriteEventCard: React.FC<EventCardProps> = ({ event, onRemove }) => {
  const statusClass = event.isUpcoming ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500';
  const statusText = event.isUpcoming ? '即將舉行' : '已結束';

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-start justify-between hover:shadow-lg transition duration-200 border-l-4 border-indigo-400">
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium text-indigo-500">{event.organizerName}</span> | {event.location}
        </p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
          <span className="font-bold">{event.date}</span>
          <span className={`px-2 py-0.5 rounded-full ${statusClass} font-medium`}>{statusText}</span>
        </div>
      </div>
      <button onClick={() => onRemove(event.id, event.title)} className="text-sm font-medium text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
        取消收藏
      </button>
    </div>
  );
};

// ----------------------------------------------------
// 4. 收藏主辦方卡片
// ----------------------------------------------------

interface OrganizerCardProps {
  organizer: FavoriteOrganizer;
  onRemove: (id: number, name: string) => void;
}

const FavoriteOrganizerCard: React.FC<OrganizerCardProps> = ({ organizer, onRemove }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200 border-t-4 border-green-400">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-grow pr-4">
          <h3 className="text-xl font-bold text-gray-900 truncate">{organizer.name}</h3>
          <p className="text-sm text-green-600 font-medium my-1">{organizer.category}</p>
          <p className="text-xs text-gray-500 mb-2 truncate">{organizer.description}</p>
          <span className="text-sm text-gray-700">
            追蹤者: <span className="font-extrabold text-indigo-600">{organizer.followers.toLocaleString()}</span>
          </span>
        </div>

        <div className="flex flex-col space-y-2 flex-shrink-0">
          <button className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition">
            查看主頁
          </button>
          <button onClick={() => onRemove(organizer.id, organizer.name)} className="text-xs font-medium text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition">
            取消收藏
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 5. 空狀態提示
// ----------------------------------------------------

interface EmptyStateProps {
  message: string;
  isSearchEmpty?: boolean;
  onClearSearch?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, isSearchEmpty = false, onClearSearch }) => (
  <div className="text-center py-20 bg-white rounded-xl shadow-lg">
    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d={isSearchEmpty ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" : "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"} />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-gray-900">{isSearchEmpty ? '沒有搜尋結果' : '收藏夾是空的'}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>

    {isSearchEmpty && onClearSearch && (
      <div className="mt-6">
        <button onClick={onClearSearch} className="px-4 py-2 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
          清除搜尋條件
        </button>
      </div>
    )}
  </div>
);

// ----------------------------------------------------
// 6. 主組件
// ----------------------------------------------------

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<FavoriteTab>('all');
  const [favoriteEvents, setFavoriteEvents] = useState<FavoriteEvent[]>(initialFavoriteEvents);
  const [favoriteOrganizers, setFavoriteOrganizers] = useState<FavoriteOrganizer[]>(initialFavoriteOrganizers);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => setCurrentSearchTerm(''), []);
  const lowerSearchTerm = currentSearchTerm.toLowerCase().trim();

  const filteredEvents = useMemo(() => {
    if (!lowerSearchTerm) return favoriteEvents;
    return favoriteEvents.filter(e =>
      e.title.toLowerCase().includes(lowerSearchTerm) ||
      e.location.toLowerCase().includes(lowerSearchTerm) ||
      e.organizerName.toLowerCase().includes(lowerSearchTerm)
    );
  }, [favoriteEvents, lowerSearchTerm]);

  const filteredOrganizers = useMemo(() => {
    if (!lowerSearchTerm) return favoriteOrganizers;
    return favoriteOrganizers.filter(o =>
      o.name.toLowerCase().includes(lowerSearchTerm) ||
      o.category.toLowerCase().includes(lowerSearchTerm) ||
      o.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [favoriteOrganizers, lowerSearchTerm]);

  const removeFavoriteEvent = useCallback((id: number, title: string) => {
    // ⚠️ 替換掉 alert/confirm
    if (window.confirm(`確定要取消收藏活動：「${title}」嗎？`)) {
      setFavoriteEvents(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  const removeFavoriteOrganizer = useCallback((id: number, name: string) => {
    // ⚠️ 替換掉 alert/confirm
    if (window.confirm(`確定要取消收藏主辦方：「${name}」嗎？`)) {
      setFavoriteOrganizers(prev => prev.filter(o => o.id !== id));
    }
  }, []);

  const allFavorites: FavoriteItem[] = useMemo(() => [...filteredEvents, ...filteredOrganizers], [filteredEvents, filteredOrganizers]);

  const tabs = [
    { id: 'all', name: '全部收藏', count: favoriteEvents.length + favoriteOrganizers.length },
    { id: 'events', name: '收藏活動', count: favoriteEvents.length },
    { id: 'organizers', name: '收藏主辦方', count: favoriteOrganizers.length },
  ];

  const renderContent = () => {
    let list: FavoriteItem[] = [];
    if (currentTab === 'events') list = filteredEvents;
    else if (currentTab === 'organizers') list = filteredOrganizers;
    else list = allFavorites;

    if (list.length === 0) {
      const label = currentTab === 'events' ? '活動' : currentTab === 'organizers' ? '主辦方' : '收藏內容';
      return (
        <EmptyState
          message={currentSearchTerm ? `找不到符合「${currentSearchTerm}」的${label}。` : `目前沒有收藏的${label}。`}
          isSearchEmpty={!!currentSearchTerm}
          onClearSearch={clearSearch}
        />
      );
    }

    return (
      <div className="space-y-4">
        {list.map(item =>
          isFavoriteOrganizer(item) ? (
            <FavoriteOrganizerCard key={`org-${item.id}`} organizer={item} onRemove={removeFavoriteOrganizer} />
          ) : (
            <FavoriteEventCard key={`evt-${item.id}`} event={item} onRemove={removeFavoriteEvent} />
          )
        )}
      </div>
    );
  };

  return (
    <div id="favorites-app" className="w-full mx-auto">

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">我的收藏</h1>
      <p className="text-gray-500">您收藏的活動與追蹤的主辦方。</p>


      <div className="mb-6 border-b border-gray-300"> {/* 外層容器承擔底部邊界 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end"> {/* items-end 讓搜尋框靠近底部邊界 */}

          {/* Tab 選項卡區域 */}
          <nav className="flex-shrink-0 flex space-x-0 w-full sm:w-auto mt-6">

            {tabs.map(tab => {
              const isActive = tab.id === currentTab;
              const tabClasses = isActive
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-500  border-transparent'; // 確保非啟用狀態也有 border-b-2 透明邊線以保持高度一致

              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as FavoriteTab)}
                  className={`py-3 px-5 text-base font-semibold leading-normal align-text-bottom transition duration-200 border-b-2 -mb-px focus:outline-none whitespace-nowrap
    ${currentTab === tab.id
                      ? "text-indigo-600 border-indigo-600"
                      : "text-gray-600 border-transparent hover:text-indigo-500 hover:border-indigo-300"
                    }`}
                >
                  {tab.name} {('count' in tab) && `(${tab.count})`}
                </button>

              );
            })}
          </nav>

          {/* 搜尋框 */}
          <div className="relative w-full sm:max-w-xs flex-shrink-0 mt-4 sm:mt-0 mb-3"> {/* mb-3 讓它與底線保持適當間距 */}
            <input
              type="text"
              placeholder={`在收藏的${currentTab === 'events' ? '活動' : currentTab === 'organizers' ? '主辦方' : '內容'}中搜尋...`}
              className="w-full border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-indigo-600 focus:border-indigo-600 transition"
              onChange={handleSearch}
              value={currentSearchTerm}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        id="favorites-content-list"
        className="max-h-[70vh] overflow-y-auto space-y-4"
      >
        {renderContent()}
      </div>

    </div>
  );
};

export default App;
