import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MovieCard, { type Movie } from '../UserLayout/components/MovieCard'; 
// Import API searchMovies từ file userAPI của bạn
import { searchMovies } from '../../../common/api/userAPI'; 

const { Title, Text } = Typography;

const SearchResults: React.FC = () => {
  // Lấy tham số 'q' từ URL (ví dụ: /search?q=Avenger)
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        // Gọi API tìm kiếm thực tế từ userAPI.ts
        const response = await searchMovies(query);
        
        // Trích xuất mảng movies từ response (Tùy theo format API backend trả về)
        const moviesData = response.data?.data?.movies || response.data?.movies || [];
        setMovies(moviesData);

      } catch (error) {
        console.error("Lỗi khi tìm kiếm phim:", error);
        setMovies([]); // Reset mảng nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Re-run mỗi khi từ khóa trên URL thay đổi

  return (
    <div className="w-full">
      {/* Header kết quả tìm kiếm */}
      <div className="mb-8 pb-4 border-b border-zinc-800/80">
        <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>
          Kết quả tìm kiếm
        </Title>
        <p className="text-zinc-400 text-base mt-2">
          {query ? (
            <>
              Tìm thấy <strong className="text-red-500">{movies.length}</strong> phim phù hợp với từ khóa "<strong className="text-white">{query}</strong>"
            </>
          ) : (
            'Vui lòng nhập từ khóa để tìm kiếm phim'
          )}
        </p>
      </div>

      {/* Khu vực hiển thị danh sách */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <Spin size="large" />
            <Text className="text-zinc-400">Đang tìm kiếm dữ liệu...</Text>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                type="upcoming" // Truyền type để hiển thị nút
              />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center h-[300px] bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <Empty
              image={
                <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchOutlined className="text-4xl text-zinc-500" />
                </div>
              }
              description={
                <span className="text-zinc-400 text-base">
                  Rất tiếc, không có bộ phim nào khớp với tìm kiếm của bạn.
                </span>
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResults;