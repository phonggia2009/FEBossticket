import React from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCinemas } from './useCinema';

const Cinemas: React.FC = () => {
  const navigate = useNavigate();
  const {
    cities, selectedCity, setSelectedCity,
    filteredCinemas, selectedCinemaId, setSelectedCinemaId,
    selectedDate, setSelectedDate, dateOptions,
    groupedShowtimes, loading, loadingShowtimes
  } = useCinemas();

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Spin size="large" /></div>;

  return (
    <div className="animate-fade-in-up flex flex-col md:flex-row gap-8">
      
      {/* CỘT TRÁI: Chọn Khu Vực & Rạp */}
      <div className="w-full md:w-80 flex-shrink-0">
        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Hệ thống Rạp
        </h2>
        
        {/* Dropdown Chọn Thành Phố */}
        {cities.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
              Khu vực
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:border-red-500 transition-colors cursor-pointer font-bold shadow-lg shadow-black/20"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {/* Icon mũi tên xổ xuống */}
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách rạp theo khu vực đã chọn */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl sticky top-24">
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {filteredCinemas.length > 0 ? (
              filteredCinemas.map(cinema => (
                <button
                  key={cinema.id}
                  onClick={() => setSelectedCinemaId(cinema.id)}
                  className={`w-full text-left p-4 border-b border-zinc-800/60 transition-all duration-200 ${
                    selectedCinemaId === cinema.id 
                      ? 'bg-zinc-800 border-l-4 border-l-red-600' 
                      : 'hover:bg-zinc-800/40 border-l-4 border-l-transparent'
                  }`}
                >
                  <h3 className={`font-bold text-base ${selectedCinemaId === cinema.id ? 'text-white' : 'text-zinc-300'}`}>
                    {cinema.cinema_name}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{cinema.address}</p>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-zinc-500 text-sm">
                Khu vực này hiện chưa có rạp chiếu.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Ngày chiếu & Suất chiếu */}
      <div className="flex-1">
        {/* Thanh chọn ngày */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-6 custom-scrollbar">
          {dateOptions.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayName = index === 0 ? 'Hôm nay' : new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date);
            const dateNumber = date.getDate();
            const monthNumber = date.getMonth() + 1;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-20 py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <span className="text-xs font-medium uppercase mb-1">{dayName}</span>
                <span className={`text-xl font-black ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {dateNumber}/{monthNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* Danh sách phim & Suất chiếu */}
        {loadingShowtimes ? (
          <div className="py-20 flex justify-center"><Spin /></div>
        ) : !selectedCinemaId ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <svg className="w-16 h-16 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <p className="text-zinc-400 text-lg font-medium">Vui lòng chọn rạp để xem suất chiếu.</p>
          </div>
        ) : groupedShowtimes.length > 0 ? (
          <div className="space-y-6">
            {groupedShowtimes.map((group) => (
              <div key={group.movie.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 shadow-lg transition-colors hover:border-zinc-700">
                {/* Ảnh phim */}
                <div 
                  className="w-32 h-48 sm:w-40 sm:h-56 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-zinc-700/50"
                  onClick={() => navigate(`/movie/${group.movie.id}`)}
                >
                  <img src={group.movie.posterUrl || 'https://placehold.co/200x300'} alt={group.movie.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* Thông tin & Giờ chiếu */}
                <div className="flex-1 flex flex-col">
                  <h3 
                    className="text-2xl font-black text-white uppercase tracking-wide cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => navigate(`/movie/${group.movie.id}`)}
                  >
                    {group.movie.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-2 mb-6 text-sm text-zinc-400 font-medium">
                    <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {group.movie.duration} phút</span>
                  </div>

                  {/* Lưới các nút giờ chiếu */}
                  <div className="mt-auto">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Chọn suất chiếu</h4>
                    <div className="flex flex-wrap gap-3">
                      {group.showtimes.sort((a,b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map(st => {
                        const timeString = new Date(st.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                        const isPast = new Date(st.start_time) < new Date(); 
                        
                        return (
                          <button
                            key={st.id}
                            disabled={isPast}
                            onClick={() => navigate(`/booking/${st.id}`)}
                            className={`px-4 py-2 rounded-lg border font-bold text-sm transition-all duration-200 ${
                              isPast 
                                ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed' 
                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-red-600 hover:border-red-500 hover:text-white shadow-sm hover:shadow-red-900/40 hover:-translate-y-0.5'
                            }`}
                          >
                            {timeString}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <svg className="w-16 h-16 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-zinc-400 text-lg font-medium">Hôm nay rạp này chưa có lịch chiếu nào.</p>
            <p className="text-zinc-600 text-sm mt-1">Vui lòng chọn rạp khác hoặc xem ngày tiếp theo.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Cinemas;