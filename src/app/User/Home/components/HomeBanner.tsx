import React, { useState, useEffect } from 'react';
import { Carousel, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../type';
import { getMovies } from '../../../../common/api/userAPI';
import { settingAPI } from '../../../../common/api/adminAPI';

interface Props {
  movie?: Movie;
}

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const HomeBanner: React.FC<Props> = ({ movie }) => {
  const navigate = useNavigate();
  const [bannerMovies, setBannerMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trailerVideoId, setTrailerVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerMovies = async () => {
      if (movie) {
        setBannerMovies([movie]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [settingRes, moviesRes] = await Promise.all([
          settingAPI.getSettings().catch(() => ({ data: { bannerMovies: [] } })),
          getMovies({ page: 1, limit: 100 })
        ]);

        const configuredBannerIds: number[] = settingRes.data.bannerMovies || [];
        const fetchedMovies: Movie[] = moviesRes.data?.data || moviesRes.data || [];

        let selectedBanners: Movie[] = [];

        if (configuredBannerIds.length > 0) {
          selectedBanners = fetchedMovies.filter((m: Movie) =>
            configuredBannerIds.includes(m.id)
          );
        }

        if (selectedBanners.length === 0 && fetchedMovies.length > 0) {
          selectedBanners = fetchedMovies.slice(0, 3);
        }

        setBannerMovies(selectedBanners);
      } catch (error) {
        console.error("Lỗi khi gọi API lấy banner phim:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerMovies();
  }, [movie]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[550px] bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (bannerMovies.length === 0) return null;

  return (
    <>
      <Carousel autoplay autoplaySpeed={4000} effect="fade" dotPosition="bottom">
        {bannerMovies.map((bannerMovie) => {
          const videoId = getYouTubeID(bannerMovie.trailerUrl || '');

          return (
            <div key={bannerMovie.id}>
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] bg-[#0a0a0a] text-white overflow-hidden font-sans group">

                {/* Background Image & Gradients */}
                <div className="absolute inset-0">
                  <img
                    src={bannerMovie.posterUrl || "https://picsum.photos/1920/1080?random=1"}
                    alt={bannerMovie.title}
                    className="w-full h-full object-cover opacity-70 transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-10" />
                </div>

                {/* Main Content Layout */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end pb-8 px-8 md:pb-12 md:px-16 lg:pb-16 lg:px-24">
                  <div className="max-w-4xl flex flex-col gap-4 transform transition-transform duration-700 ease-in-out translate-y-6 group-hover:translate-y-0">

                    {/* Badge */}
                    <div className="bg-[#E53935] text-white text-xs font-bold px-3 py-1 rounded w-max flex items-center gap-2 uppercase tracking-wide shadow-lg">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.64,5.93h0l1.2,2.19,1.16,2.13.34.62L15,10.22l.14-.24a3.55,3.55,0,0,1,1-.92,3.34,3.34,0,0,1,1.52-.4,3.22,3.22,0,0,1,2.37,1,3.41,3.41,0,0,1,1,2.44,4.28,4.28,0,0,1-1.25,3A4.2,4.2,0,0,1,16.66,16.4a4.11,4.11,0,0,1-2.91-1.22,4.23,4.23,0,0,1-1.21-3h0L11.5,10l-1,1.82h0a4.13,4.13,0,0,0-1,3A4.24,4.24,0,0,0,10.66,17.9a4.11,4.11,0,0,0,2.91,1.22,4.2,4.2,0,0,0,3-1.27,4.36,4.36,0,0,0,1.25-3,4.8,4.8,0,0,0-1.44-3.41,4.68,4.68,0,0,0-3.32-1.39,4.8,4.8,0,0,0-2.12.57,4.66,4.66,0,0,0-1.36,1.23L9.12,12.55l-1-1.85a3.42,3.42,0,0,1-1-2.44,3.22,3.22,0,0,1,1-2.37A3.34,3.34,0,0,1,9.66,5.5a3.55,3.55,0,0,1,.92,1l.24.14.65-1.19.62-.34.58.33.52-.3A2.06,2.06,0,0,0,11.64,5.93Z" />
                      </svg>
                      Phim Hot Nhất
                    </div>

                    {/* Title */}
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
                      {/* Description */}
                      <p className="text-[#e4e4e7] text-base md:text-lg max-w-2xl leading-relaxed mt-2 line-clamp-2 drop-shadow-md">
                        {bannerMovie.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 mt-6">
                        {/* ✅ Đặt Vé: điều hướng đến /movie/:id */}
                        <button
                          onClick={() => navigate(`/movie/${bannerMovie.id}`)}
                          className="bg-[#E53935] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(229,57,53,0.5)] uppercase text-sm tracking-wider"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 6h-2V4h-2v2H8V4H6v2H4c-1.1 0-2 .9-2 2v3c1.1 0 2 .9 2 2s-.9 2-2 2v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-3c-1.1 0-2-.9-2-2s.9-2 2-2V8c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V8h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z" />
                          </svg>
                          Đặt Vé Ngay
                        </button>

                        {videoId ? (
                          <button
                            onClick={() => setTrailerVideoId(videoId)}
                            className="bg-[#1a1a1a]/80 hover:bg-[#2a2a2a] border border-gray-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-300 uppercase text-sm tracking-wider"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Xem Trailer
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-[#1a1a1a]/50 border border-gray-800 text-gray-600 font-bold py-3 px-6 rounded-lg flex items-center gap-2 uppercase text-sm tracking-wider cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Chưa có Trailer
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
      <Modal
        title={<span className="text-white text-lg">Trailer</span>}
        open={!!trailerVideoId}
        onCancel={() => setTrailerVideoId(null)}
        footer={null}
        width={900}
        centered
        destroyOnClose
        styles={{
          content: { backgroundColor: '#18181b', border: '1px solid #3f3f46' },
          header: { backgroundColor: '#18181b', borderBottom: '1px solid #3f3f46' },
          mask: { backdropFilter: 'blur(5px)' }
        }}
      >
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailerVideoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </Modal>
    </>
  );
};

export default HomeBanner;