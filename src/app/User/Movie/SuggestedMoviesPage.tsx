import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import type { RootState } from '../../../store'; // Đảm bảo đường dẫn này đúng với store Redux của bạn
import { getSuggestedVideos, getPersonalizedVideos } from '../../../common/api/userAPI';

interface SuggestedMovie {
  id: number;
  title: string;
  posterUrl: string;
  // Đã loại bỏ trailerUrl vì không còn sử dụng
}

const SuggestedMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Lấy thông tin user để quyết định gọi API cá nhân hóa hay API ngẫu nhiên
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [movies, setMovies] = useState<SuggestedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = user 
          ? await getPersonalizedVideos() 
          : await getSuggestedVideos();
          
        const data = res.data?.data || res.data || [];
        setMovies(data);
      } catch (error) {
        console.error("Lỗi khi lấy phim gợi ý:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user]);

  return (
    <div className="animate-fade-in-up">
      {/* Tiêu đề trang */}
      <div className="mb-8 border-l-4 border-red-600 pl-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">
          Phim <span className="text-red-500">Dành Cho Bạn</span>
        </h1>
        <p className="text-zinc-500 mt-2">
          {user 
            ? 'Danh sách được hệ thống tinh chọn riêng dựa trên sở thích xem phim của bạn.' 
            : 'Khám phá các siêu phẩm điện ảnh ngẫu nhiên hấp dẫn nhất hiện nay.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[2/3] border border-zinc-800 hover:border-red-500 transition-all duration-300 shadow-lg"
              // Chuyển hướng đến trang chi tiết phim khi click
              onClick={() => navigate(`/movie/${movie.id}`)} 
            >
              {/* Ảnh bìa */}
              <img 
                src={movie.posterUrl || 'https://placehold.co/400x600/18181b/red?text=No+Image'} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay làm nền cho chữ */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

              {/* Thông tin phim */}
              <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-base line-clamp-2 leading-snug">{movie.title}</h3>
                <span className="text-red-500 text-xs font-semibold mt-1 inline-block uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Xem chi tiết →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg">Hiện chưa có gợi ý nào dành cho bạn.</p>
        </div>
      )}
    </div>
  );
};

export default SuggestedMoviesPage;