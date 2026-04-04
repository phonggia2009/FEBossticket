import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getMovies, deleteMovie, getGenres, searchMovies } from '../../../../common/api/adminAPI';
import type { Movie, Genre } from './type';

export const useMovieManager = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Thêm State quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const [movieRes, genreRes] = await Promise.all([getMovies(page, 5), getGenres()]);
      
      // --- BẮT ĐÚNG DỮ LIỆU AN TOÀN ---
      const payload = movieRes.data;
      
      // 1. Tìm danh sách phim (Nếu backend gom chung vào data.movies hoặc để trực tiếp ở data)
      const movieList = payload.data?.movies || payload.data || [];
      setMovies(movieList);
      
      // 2. Tìm thông tin phân trang (Nằm ngoài cùng hoặc nằm trong data)
      const pageInfo = payload.pagination || payload.data?.pagination;
      
      if (pageInfo) {
        setPagination({
          current: pageInfo.currentPage || 1,
          pageSize: 5,
          total: pageInfo.totalItems || 0,
        });
      }

      const genresData = genreRes.data.data?.genres || genreRes.data.data || [];
      setGenres(genresData);
      
    } catch (err) {
      console.error("Fetch Data Error: ", err);
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      fetchData(1);
      return;
    }
    setSearching(true);
    try {
      const res = await searchMovies(value);
      const searchData = res.data.data.movies || res.data.data;
      setMovies(searchData);
      // Reset phân trang về 1 khi tìm kiếm
      setPagination(prev => ({ ...prev, current: 1, total: searchData.length }));
    } catch (err) {
      message.error("Không tìm thấy phim phù hợp");
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMovie(id);
      message.success("Đã chuyển phim vào thùng rác");
      fetchData(pagination.current); 
    } catch (err: any) {
      // 1. Bọc lót lấy thông báo lỗi từ mọi cấu trúc có thể có của Backend
      const errorData = err.response?.data;
      
      const errorMsg = errorData?.message 
                    || errorData?.error 
                    || (typeof errorData === 'string' ? errorData : null)
                    || "Lỗi khi xóa phim. Vui lòng thử lại!";
      
      // 2. Hiển thị thông báo lên màn hình bằng Ant Design message
      message.error(errorMsg);
    }
  };

  // Load trang đầu tiên khi vào màn hình
  useEffect(() => { fetchData(1); }, [fetchData]);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  return {
    movies, genres, loading, searching, isModalOpen, setIsModalOpen, editingMovie, setEditingMovie,
    fetchData, handleSearch, handleDelete, pagination, handlePageChange
  };
};