import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  duration: number;
  releaseDate: string;
  genres: Genre[];
}

interface MovieCardProps {
  movie: Movie;
  type: 'now-showing' | 'upcoming';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, type }) => {
  const navigate = useNavigate();
  
  // Xử lý chuỗi thể loại
  const genreText = movie.genres && movie.genres.length > 0 
    ? movie.genres.map(g => g.name).join(', ') 
    : 'Chưa cập nhật';

  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-lg hover:shadow-red-900/20 flex flex-col h-full">
      {/* Hình ảnh & Overlay */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.posterUrl || 'https://placehold.co/400x600/18181b/red?text=No+Image'} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80" />

        {/* Nút Hover hiển thị khi trỏ chuột */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300">
          <button 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="w-3/4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 transition-colors"
          >
            {type === 'now-showing' ? 'ĐẶT VÉ' : 'THÔNG TIN'}
          </button>
        </div>

        {/* Nhãn Ngày khởi chiếu (Chỉ hiện cho phim sắp chiếu) */}
        {type === 'upcoming' && movie.releaseDate && (
          <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl">
            {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
          </div>
        )}
      </div>

      {/* Thông tin Text bên dưới */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/movie/${movie.id}`} className="hover:text-red-500 transition-colors">
          <h3 className="text-white font-black text-lg line-clamp-1" title={movie.title}>
            {movie.title}
          </h3>
        </Link>
        <p className="text-zinc-500 text-sm mt-1 mb-3 line-clamp-1" title={genreText}>
          {genreText}
        </p>
        
        {/* Đẩy thời lượng xuống đáy thẻ */}
        <div className="mt-auto flex items-center gap-2 text-zinc-400 text-sm font-medium">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {movie.duration} phút
        </div>
      </div>
    </div>
  );
};

export default MovieCard;