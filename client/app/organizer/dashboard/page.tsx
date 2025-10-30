// 檔案位置: client/app/(organizer)/dashboard/page.tsx

'use client'; 

import { useState, useEffect } from 'react';

interface Event {
  id: number;              
  organizer_id: number;    
  title: string;           
  subtitle: string | null;  
  description: string | null; 
  cover_image: string;      
  start_time: string;       
  end_time: string;         
  location_name: string | null; 
  address: string | null;  
  latitude: number | null;  
  longitude: number | null; 
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT'; 
  event_type: 'OFFLINE' | 'ONLINE'; 
  online_event_url: string | null; 
  category_id: number | null; 
  tag_id: number | null;    
  created_at: string;      
  updated_at: string;      
}

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/organizer/events');

        if (!response.ok) {
          throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
          setEvents(result.data); 
        } else {
          throw new Error(result.message || 'API 回傳錯誤');
        }

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('發生未知錯誤');
        }
      } finally {
        setIsLoading(false); 
      }
    };

    fetchEvents(); 
  }, []); 

  // 6. 根據載入狀態，顯示不同的畫面
  const renderContent = () => {
    if (isLoading) {
      return <p>正在從您的 API (http://localhost:3001) 載入活動資料...</p>;
    }

    if (error) {
      return <p style={{ color: 'red' }}>抓取 API 時發生錯誤: {error}</p>;
    }

    if (events.length === 0) {
      return (
        <div>
          <p>您的儀表板沒有任何活動。</p>
          <p>
            (這是正常的，因為 MOCK_ORGANIZER_ID=1 的主辦方在資料庫中還沒有建立任何活動)
          </p>
        </div>
      );
    }

    // 成功！顯示活動列表
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event) => (
          <li key={event.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <strong>{event.title}</strong>
            <br />
            <small>狀態: {event.status}</small>
            <br />
            <small>時間: {new Date(event.start_time).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>主辦方儀表板 (模組二)</h1>
      <p>
        此頁面正在呼叫: <code>http://localhost:3001/api/v1/organizer/events</code>
      </p>
      
      <hr style={{ margin: '20px 0' }} />

      {/* 顯示內容 */}
      {renderContent()}
    </div>
  );
}