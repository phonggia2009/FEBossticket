import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { getMovies } from '../../../common/api/userAPI';

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  rating: string;
  posterUrl: string;
  trailerUrl: string;
  genres: Genre[];
}

const NowShowingPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const LIMIT = 12;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await getMovies({ status: 'now-showing', page, limit: LIMIT });
        setMovies(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      } catch {
        setError('Không thể tải danh sách phim. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  // Lấy tất cả thể loại từ danh sách phim
  const allGenres = Array.from(
    new Map(
      movies.flatMap(m => m.genres).map(g => [g.id, g])
    ).values()
  );

  const filteredMovies =
    selectedGenre === 'all'
      ? movies
      : movies.filter(m => m.genres.some(g => String(g.id) === selectedGenre));

  const getRatingColor = (rating: string) => {
    const map: Record<string, string> = {
      G: 'bg-green-500',
      PG: 'bg-blue-500',
      'PG-13': 'bg-yellow-500',
      R: 'bg-orange-500',
      'NC-17': 'bg-red-600',
    };
    return map[rating] || 'bg-zinc-600';
  };

  return (
    <>
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-0">
        <div className="mb-8 border-l-4 border-zinc-500 pl-4">
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">
            Phim <span className="text-zinc-400">Đang Chiếu</span>
          </h1>
          <p className="text-zinc-500 mt-2">
            {loading ? 'Đang tải...' : `${filteredMovies.length} bộ phim đang chiếu tại rạp`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Genre Filter */}
        {!loading && allGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelectedGenre('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                ${selectedGenre === 'all'
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                }`}
            >
              Tất cả
            </button>
            {allGenres.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(String(g.id))}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                  ${selectedGenre === String(g.id)
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                  }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => setPage(1)}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-zinc-800 mb-3" />
                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && (
          <>
            {filteredMovies.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <p className="text-zinc-400 text-lg">Không có phim nào phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movies/${movie.id}`)}
                    className="group cursor-pointer"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-zinc-800 shadow-lg shadow-black/40">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                          className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold
                            py-2.5 rounded-lg transition-colors mb-2"
                        >
                          Đặt vé ngay
                        </button>
                        {movie.trailerUrl && getYouTubeID(movie.trailerUrl) && (
                          <button
                            onClick={e => { e.stopPropagation(); setTrailerMovie(movie); }}
                            className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium
                              py-2 rounded-lg transition-colors text-center backdrop-blur-sm"
                          >
                            ▶ Xem trailer
                          </button>
                        )}
                      </div>

                      {/* Rating badge */}
                      {movie.rating && (
                        <div className={`absolute top-2 left-2 ${getRatingColor(movie.rating)}
                          text-white text-xs font-bold px-2 py-0.5 rounded`}>
                          {movie.rating}
                        </div>
                      )}

                      {/* Duration badge */}
                      {movie.duration && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm
                          text-zinc-300 text-xs px-2 py-0.5 rounded">
                          {movie.duration} phút
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-sm text-white leading-snug mb-1.5
                        group-hover:text-red-400 transition-colors line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map(g => (
                          <span key={g.id}
                            className="text-xs text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-full">
                            {g.name}
                          </span>
                        ))}
                        {movie.genres.length > 2 && (
                          <span className="text-xs text-zinc-600">+{movie.genres.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm
                    hover:border-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...');
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="text-zinc-600 px-1">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                          ${page === p
                            ? 'bg-red-500 text-white border border-red-500'
                            : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                          }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm
                    hover:border-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Tiếp →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>

      {/* Modal Trailer */}
      <Modal
        title={<span className="text-white text-lg">Trailer: {trailerMovie?.title}</span>}
        open={!!trailerMovie}
        onCancel={() => setTrailerMovie(null)}
        footer={null}
        width={900}
        centered
        destroyOnClose
        styles={{
          content: { backgroundColor: '#18181b', border: '1px solid #3f3f46' },
          header: { backgroundColor: '#18181b', borderBottom: '1px solid #3f3f46' },
          mask: { backdropFilter: 'blur(5px)' },
        }}
      >
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-4">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailerMovie ? getYouTubeID(trailerMovie.trailerUrl) : ''}?autoplay=1`}
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

export default NowShowingPage;