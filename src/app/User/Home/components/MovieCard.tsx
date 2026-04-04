import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../type';

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/60 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-red-900/20 hover:border-zinc-700">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/1a1a1a/ef4444?text=Chưa+có+ảnh';
          }}
        />
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm px-4">
          <Link 
            to={`/movie/${movie.id}?action=book`} 
            className="w-full max-w-[160px] text-center bg-red-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-red-500 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg shadow-red-900/50"
          >
            MUA VÉ NGAY
          </Link>
          <Link 
            to={`/movie/${movie.id}`} 
            className="w-full max-w-[160px] text-center bg-transparent border-2 border-zinc-400 text-zinc-200 text-sm font-bold py-2 rounded-lg hover:bg-zinc-200 hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            CHI TIẾT
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-zinc-100 truncate" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex justify-between items-center mt-1.5 text-xs text-zinc-500 font-medium">
          <span className="truncate pr-2">
            {movie.genres?.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'Đang cập nhật'}
          </span>
          <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400 whitespace-nowrap">
            {movie.duration ? `${movie.duration}p` : '??p'}
          </span>
        </div>
        <div className="mt-2 text-xs text-zinc-600">
          Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;