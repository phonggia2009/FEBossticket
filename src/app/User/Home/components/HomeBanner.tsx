import React, { useState, useEffect } from 'react';
import type { Movie } from '../type';
// Lưu ý: Cập nhật lại đường dẫn import này cho đúng với cấu trúc thư mục thực tế của bạn
import { getMovies } from '../../../../common/api/userAPI'; 

interface Props {
  movie?: Movie;
}

const HomeBanner: React.FC<Props> = ({ movie }) => {
  const [bannerMovie, setBannerMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBannerMovie = async () => {
      if (movie) {
        setBannerMovie(movie);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getMovies({ page: 1, limit: 1 }); 
        const fetchedMovies = response.data?.data || response.data || [];
        
        if (fetchedMovies.length > 0) {
          setBannerMovie(fetchedMovies[0]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API lấy banner phim:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerMovie();
  }, [movie]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[550px] bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!bannerMovie) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] bg-[#0a0a0a] text-white overflow-hidden font-sans group">
      
      {/* Background Image & Gradients */}
      <div className="absolute inset-0">
        <img 
          src={bannerMovie.posterUrl || "https://picsum.photos/1920/1080?random=1"} 
          alt={bannerMovie.title} 
          // ĐIỀU CHỈNH 1: Tăng opacity từ opacity-40 lên opacity-70 để ảnh sáng hơn
          className="w-full h-full object-cover opacity-70 transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        {/* ĐIỀU CHỈNH 2: Làm gradient tối nhẹ hơn (giảm từ via-[#0a0a0a]/80 xuống via-[#0a0a0a]/50) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-10" />
      </div>

      {/* Main Content Layout */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-8 px-8 md:pb-12 md:px-16 lg:pb-16 lg:px-24">
        
        <div className="max-w-4xl flex flex-col gap-4 transform transition-transform duration-700 ease-in-out translate-y-6 group-hover:translate-y-0">
          
          {/* Badge */}
          <div className="bg-[#E53935] text-white text-xs font-bold px-3 py-1 rounded w-max flex items-center gap-2 uppercase tracking-wide shadow-lg">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.64,5.93h0l1.2,2.19,1.16,2.13.34.62L15,10.22l.14-.24a3.55,3.55,0,0,1,1-.92,3.34,3.34,0,0,1,1.52-.4,3.22,3.22,0,0,1,2.37,1,3.41,3.41,0,0,1,1,2.44,4.28,4.28,0,0,1-1.25,3A4.2,4.2,0,0,1,16.66,16.4a4.11,4.11,0,0,1-2.91-1.22,4.23,4.23,0,0,1-1.21-3h0L11.5,10l-1,1.82h0a4.13,4.13,0,0,0-1,3A4.24,4.24,0,0,0,10.66,17.9a4.11,4.11,0,0,0,2.91,1.22,4.2,4.2,0,0,0,3-1.27,4.36,4.36,0,0,0,1.25-3,4.8,4.8,0,0,0-1.44-3.41,4.68,4.68,0,0,0-3.32-1.39,4.8,4.8,0,0,0-2.12.57,4.66,4.66,0,0,0-1.36,1.23L9.12,12.55l-1-1.85a3.42,3.42,0,0,1-1-2.44,3.22,3.22,0,0,1,1-2.37A3.34,3.34,0,0,1,9.66,5.5a3.55,3.55,0,0,1,.92,1l.24.14.65-1.19.62-.34.58.33.52-.3A2.06,2.06,0,0,0,11.64,5.93Z"/>
            </svg>
            Phim Hot Nhất
          </div>

          {/* Title - Thêm drop-shadow đậm hơn để nổi bật trên nền ảnh sáng */}
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter text-white leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {bannerMovie.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-gray-300 font-medium text-sm mt-1 drop-shadow-md">
            <span>{bannerMovie.releaseDate ? new Date(bannerMovie.releaseDate).getFullYear() : '2027'}</span>
            <span className="text-gray-500">•</span>
            <span>{bannerMovie.duration || '120'} phút</span>
            
            {bannerMovie.genres && bannerMovie.genres.length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <div className="flex gap-2">
                  {bannerMovie.genres.slice(0, 2).map((genre: any, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full border border-gray-600/60 bg-[#1a1a1a]/70 text-gray-200 text-xs">
                      {genre.name || genre} 
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out delay-100">
            {/* Description - Thêm drop-shadow để dễ đọc */}
            <p className="text-[#e4e4e7] text-base md:text-lg max-w-2xl leading-relaxed mt-2 line-clamp-2 drop-shadow-md">
              {bannerMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button className="bg-[#E53935] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(229,57,53,0.5)] uppercase text-sm tracking-wider">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2V4h-2v2H8V4H6v2H4c-1.1 0-2 .9-2 2v3c1.1 0 2 .9 2 2s-.9 2-2 2v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-3c-1.1 0-2-.9-2-2s.9-2 2-2V8c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V8h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z"/>
                </svg>
                Đặt Vé Ngay
              </button>

              <button className="bg-[#1a1a1a]/80 hover:bg-[#2a2a2a] border border-gray-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-300 uppercase text-sm tracking-wider">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem Trailer
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;