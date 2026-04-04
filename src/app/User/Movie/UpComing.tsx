import React, { useEffect, useState } from 'react';
import { Spin, Pagination } from 'antd';
import { getMovies } from '../../../common/api/userAPI'; 
import MovieCard, { type Movie } from '../UserLayout/components/MovieCard';

const Upcoming: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      // NOTE: Truyền thêm status='upcoming' nếu Backend đã cấu hình để lọc
      const res = await getMovies({ page, limit: pageSize, status: 'upcoming' });
      
      const data = res.data?.data || res.data?.movies || [];
      setMovies(data);
      
      if (res.data?.pagination) {
        setTotalItems(res.data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách phim sắp chiếu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 border-l-4 border-zinc-500 pl-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">
          Phim <span className="text-zinc-400">Sắp Chiếu</span>
        </h1>
        <p className="text-zinc-500 mt-2">Đón chờ những siêu phẩm sắp đổ bộ rạp chiếu</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} type="upcoming" />
            ))}
          </div>

          {totalItems > pageSize && (
            <div className="mt-12 flex justify-center">
               <Pagination 
                  current={currentPage} 
                  total={totalItems} 
                  pageSize={pageSize} 
                  onChange={(page) => setCurrentPage(page)} 
                  showSizeChanger={false}
                  className="custom-dark-pagination"
               />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg">Chưa có thông tin phim sắp chiếu lúc này.</p>
        </div>
      )}
    </div>
  );
};

export default Upcoming;