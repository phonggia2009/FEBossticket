// src/app/Admin/pages/Movie/useMovieTrash.ts

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getMovieTrash, restoreMovie } from '../../../../common/api/adminAPI';
import type { Movie } from './type';

export const useMovieTrash = () => {
  const [loading, setLoading] = useState(false);
  const [trashData, setTrashData] = useState<Movie[]>([]);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMovieTrash();
      setTrashData(res.data.data.deletedMovies);
    } catch (err) {
      message.error('Không thể tải danh sách thùng rác');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRestore = async (id: number) => {
    try {
      await restoreMovie(id);
      message.success('Khôi phục phim thành công');
      fetchTrash();
    } catch (err) {
      message.error('Lỗi khi khôi phục phim');
    }
  };

  useEffect(() => { fetchTrash(); }, [fetchTrash]);

  return { trashData, loading, handleRestore };
};