import React, { useState } from 'react';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import type { MovieDetail } from '../type';

interface Props {
  movie: MovieDetail;
}

// Hàm lấy ID của video YouTube từ một URL bất kỳ (Tái sử dụng từ Admin của bạn)
const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const MovieInfo: React.FC<Props> = ({ movie }) => {
  // State quản lý việc đóng/mở Modal Trailer
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  
  // Lấy ra mã ID của video
  const videoId = getYouTubeID(movie.trailerUrl);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Cột trái: Poster & Nút Trailer */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-72 lg:w-80 gap-6">
          <div className="w-48 md:w-full rounded-xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-zinc-800">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full h-auto object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/1a1a1a/ef4444?text=Chưa+có+ảnh'; }}
            />
          </div>
          
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => {
                 window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
              className="w-full text-center bg-red-600 text-white font-black text-lg py-3.5 rounded-lg hover:bg-red-500 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-red-900/40"
            >
              MUA VÉ NGAY
            </button>
            {videoId ? (
              <button 
                onClick={() => setIsTrailerOpen(true)}
                className="w-full text-center bg-transparent border-2 border-zinc-600 text-zinc-300 font-bold text-sm py-2.5 rounded-lg hover:border-white hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                XEM TRAILER
              </button>
            ) : (
              <button disabled className="w-full text-center bg-zinc-900 border border-zinc-800 text-zinc-600 font-bold text-sm py-2.5 rounded-lg cursor-not-allowed">
                CHƯA CÓ TRAILER
              </button>
            )}
          </div>
        </div>

        {/* Cột phải: Chi tiết phim (Giữ nguyên) */}
        <div className="flex-1 pt-4 md:pt-16 pb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wide mb-4 text-center md:text-left drop-shadow-md">
            {movie.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 text-sm md:text-base font-medium">
            <span className="bg-red-600/20 text-red-500 border border-red-900/50 px-3 py-1 rounded-md">
              {movie.duration ? `${movie.duration} phút` : 'Chưa cập nhật'}
            </span>
            <span className="text-zinc-400 flex items-center gap-1.5">
              Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
            </span>
            {movie.genres?.length > 0 && (
              <div className="flex gap-2">
                {movie.genres.map(g => (
                  <span key={g.id} className="text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-md">{g.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              NỘI DUNG PHIM
            </h3>
            <p className="text-zinc-400 leading-relaxed text-justify whitespace-pre-line">
              {movie.description !== 'null' && movie.description !== '' ? movie.description : 'Đang cập nhật nội dung...'}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          MODAL HIỂN THỊ VIDEO YOUTUBE
      ============================================= */}
      <Modal
        title={<span className="text-white text-lg">Trailer: {movie.title}</span>}
        open={isTrailerOpen}
        onCancel={() => setIsTrailerOpen(false)}
        footer={null}
        width={900}
        centered
        destroyOnClose // Rất quan trọng: Hủy iframe khi tắt Modal để tránh video vẫn phát tiếng chìm
        className="dark-modal" // Thêm class nếu bạn muốn custom CSS riêng cho modal tối màu
        styles={{ 
          content: { backgroundColor: '#18181b', border: '1px solid #3f3f46' }, // Màu zinc-900 và zinc-700
          header: { backgroundColor: '#18181b', borderBottom: '1px solid #3f3f46' },
          mask: { backdropFilter: 'blur(5px)' } // Hiệu ứng mờ nền xung quanh
        }}
      >
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </>
  );
};

export default MovieInfo;