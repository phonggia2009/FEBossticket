import React, { useEffect, useState } from 'react';
import { Spin, Pagination } from 'antd';
// Đảm bảo import đúng đường dẫn API của bạn
import { getMovies } from '../../common/api/userAPI'; 
import MovieCard, { type Movie } from './UserLayout/components/MovieCard';

const NowShowing: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Số lượng phim trên mỗi trang

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      // NOTE: Bạn có thể truyền thêm param status='now-showing' nếu Backend hỗ trợ
      const res = await getMovies({ page, limit: pageSize, status: 'now-showing' });
      
      const data = res.data?.data || res.data?.movies || [];
      setMovies(data);
      
      const pagination = res.data?.pagination;
      if (pagination) {
        setTotalItems(pagination.totalItems);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Tiêu đề trang */}
      <div className="mb-8 border-l-4 border-red-600 pl-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">
          Phim <span className="text-red-500">Đang Chiếu</span>
        </h1>
        <p className="text-zinc-500 mt-2">Khám phá các bộ phim bom tấn đang có mặt tại BOSSTICKET</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : movies.length > 0 ? (
        <>
          {/* Lưới hiển thị phim */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} type="now-showing" />
            ))}
          </div>

          {/* Phân trang */}
          {totalItems > pageSize && (
            <div className="mt-12 flex justify-center">
               <Pagination 
                  current={currentPage} 
                  total={totalItems} 
                  pageSize={pageSize} 
                  onChange={(page) => setCurrentPage(page)} 
                  showSizeChanger={false}
                  // Override class của antd để hợp Dark Mode
                  className="custom-dark-pagination"
               />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg">Hiện tại chưa có phim nào đang chiếu.</p>
        </div>
      )}
    </div>
  );
};

export default NowShowing;