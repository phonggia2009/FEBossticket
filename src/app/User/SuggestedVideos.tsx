import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getSuggestedVideos } from '../../common/api/userAPI'; // Đổi lại đường dẫn cho đúng

interface SuggestedMovie {
  id: number;
  title: string;
  trailerUrl: string;
  posterUrl: string;
}

// Hàm cắt lấy ID YouTube giống như bạn đã dùng
const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const SuggestedVideos = () => {
  const [movies, setMovies] = useState<SuggestedMovie[]>([]);
  const [activeMovie, setActiveMovie] = useState<SuggestedMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getSuggestedVideos();
        const data = res.data.data;
        setMovies(data);
        if (data.length > 0) {
          setActiveMovie(data[0]); // Mặc định chọn phim đầu tiên
        }
      } catch (error) {
        console.error("Lỗi lấy video gợi ý:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="py-10 text-center"><Spin /></div>;
  if (movies.length === 0) return null;

  const activeVideoId = getYouTubeID(activeMovie?.trailerUrl || '');

  return (
    <div className="py-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-white mb-8 uppercase flex items-center gap-3">
          <span className="w-2 h-8 bg-red-600 rounded-full"></span>
          Trailer Gợi Ý
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* MÀN HÌNH PHÁT VIDEO CHÍNH (Bên trái) */}
          <div className="lg:w-2/3 bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 border border-zinc-800">
            {activeVideoId ? (
              <div className="relative w-full aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&mute=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-zinc-900 text-zinc-500">
                Lỗi video
              </div>
            )}
            <div className="p-4 bg-zinc-900">
              <h3 className="text-xl font-bold text-white">{activeMovie?.title}</h3>
            </div>
          </div>

          {/* DANH SÁCH VIDEO GỢI Ý (Bên phải) */}
          <div className="lg:w-1/3 flex flex-col gap-3 h-full max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {movies.map((movie) => {
              const isActive = activeMovie?.id === movie.id;
              return (
                <div
                  key={movie.id}
                  onClick={() => setActiveMovie(movie)}
                  className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                    isActive 
                      ? 'bg-red-600/10 border-red-500' 
                      : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircleOutlined className={`text-3xl ${isActive ? 'text-red-500' : 'text-white'}`} />
                    </div>
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className={`font-bold line-clamp-2 ${isActive ? 'text-red-500' : 'text-zinc-200'}`}>
                      {movie.title}
                    </h4>
                    <span className="text-xs text-zinc-500 mt-2 inline-block bg-zinc-800 px-2 py-1 rounded">
                      Trailer
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedVideos;