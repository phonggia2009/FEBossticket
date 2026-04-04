// src/app/User/pages/Home/useHome.ts

import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { getMovies } from '../../../common/api/userAPI'; 
import type { Movie } from './type';

export const useHome = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'now-showing' | 'coming-soon'>('now-showing');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Truyền tham số để lấy 20 phim từ Backend (tránh bị limit 5)
        const res = await getMovies({ page: 1, limit: 20 });
        
        // Logic bọc lót an toàn đã làm ở bước trước
        const payloadData = res.data?.data;
        const movieList = Array.isArray(payloadData) 
          ? payloadData 
          : (payloadData?.movies || []);
          
        setMovies(movieList);

      } catch (error) {
        console.error("Lỗi lấy danh sách phim", error);
        message.error("Không thể kết nối đến máy chủ để tải phim!");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const now = useMemo(() => new Date(), []);
  
  // Lọc phim và GIỚI HẠN số lượng hiển thị bằng .slice(0, 8) (tức là tối đa 8 phim mỗi Tab)
  const nowShowing = useMemo(() => {
    return movies
      .filter(m => new Date(m.releaseDate) <= now)
      .slice(0, 8); // Đổi số 8 thành số lượng bạn muốn
  }, [movies, now]);

  const comingSoon = useMemo(() => {
    return movies
      .filter(m => new Date(m.releaseDate) > now)
      .slice(0, 8); // Đổi số 8 thành số lượng bạn muốn
  }, [movies, now]);
  
  const displayMovies = activeTab === 'now-showing' ? nowShowing : comingSoon;

  return {
    movies,
    loading,
    activeTab,
    setActiveTab,
    nowShowingCount: nowShowing.length,
    comingSoonCount: comingSoon.length,
    displayMovies
  };
};