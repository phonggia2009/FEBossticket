import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import type { Showtime } from '../type';

interface Props {
  dates: Date[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  loadingShowtimes: boolean;
  groupedShowtimes: Record<string, Showtime[]>;
}

const ShowtimeSection: React.FC<Props> = ({ 
  dates, selectedDate, setSelectedDate, loadingShowtimes, groupedShowtimes 
}) => {

  // Lọc trước dữ liệu: Chỉ giữ lại các rạp có ít nhất 1 suất chiếu chưa bắt đầu
  const filteredGroupedShowtimes = useMemo(() => {
    const now = new Date();
    
    return Object.entries(groupedShowtimes).reduce((acc, [cinemaName, times]) => {
      // Chỉ lấy các suất chưa bắt đầu
      const availableTimes = times.filter(st => new Date(st.start_time) > now);
      
      // Nếu rạp này còn suất chiếu thì mới đưa vào danh sách hiển thị
      if (availableTimes.length > 0) {
        acc[cinemaName] = availableTimes;
      }
      return acc;
    }, {} as Record<string, Showtime[]>);
  }, [groupedShowtimes]);

  // Kiểm tra xem có bất kỳ rạp nào còn suất chiếu không
  const hasAvailableShowtimes = Object.keys(filteredGroupedShowtimes).length > 0;

  return (
    <div className="mt-12 pt-8 border-t border-zinc-800/60">
      <h3 className="text-2xl font-black text-white mb-6 uppercase text-center md:text-left flex items-center gap-3">
        <span className="w-2 h-8 bg-red-600 rounded-full"></span>
        Lịch Chiếu
      </h3>

      {/* Thanh chọn ngày */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-6 custom-scrollbar">
        {dates.map((d, index) => {
          const dateStr = d.toISOString().split('T')[0];
          const isSelected = selectedDate === dateStr;
          const dayName = index === 0 ? 'Hôm nay' : new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(d);
          const dayNumber = d.getDate();
          const monthNumber = d.getMonth() + 1;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border transition-all duration-300 ${
                isSelected 
                  ? 'bg-red-600 border-red-500 shadow-lg shadow-red-900/40 text-white' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-wider mb-1">{dayName}</span>
              <span className="text-xl font-black">{`${dayNumber}/${monthNumber}`}</span>
            </button>
          );
        })}
      </div>

      {/* Danh sách rạp và giờ chiếu */}
      {loadingShowtimes ? (
        <div className="flex justify-center py-12"><Spin /></div>
      ) : !hasAvailableShowtimes ? (
        // Hiển thị thông báo nếu KHÔNG có rạp nào có suất chiếu (chưa có hoặc đã chiếu xong)
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-10 text-center">
          <p className="text-zinc-400 text-lg">Chưa có suất chiếu nào hoặc các suất hôm nay đã bắt đầu.</p>
          <p className="text-zinc-600 text-sm mt-2">Vui lòng chọn một ngày khác để xem lịch chiếu.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(filteredGroupedShowtimes).map(([cinemaName, availableTimes]) => (
            <div key={cinemaName} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {cinemaName}
              </h4>
              <div className="flex flex-wrap gap-3">
                {availableTimes.map((st) => {
                  const timeString = new Date(st.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <Link
                      key={st.id}
                      to={`/booking/${st.id}`} 
                      className="group flex flex-col items-center bg-zinc-950 border border-zinc-700 px-4 py-2 rounded-lg hover:border-red-500 hover:bg-red-600/10 transition-all cursor-pointer"
                    >
                      <span className="text-white font-bold text-lg group-hover:text-red-500 transition-colors">
                        {timeString}
                      </span>
                      <span className="text-zinc-500 text-xs mt-0.5">
                        {st.room?.room_name || 'Phòng chiếu'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowtimeSection;