import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getMovieDetails, getShowtimesByMovie } from '../../../common/api/userAPI';
import type { MovieDetail, Showtime } from './type';

const generateNext7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const useMovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  
  const todayString = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayString);
  const dates = useMemo(() => generateNext7Days(), []);

  // 1. Gọi API chi tiết phim
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        // DÙNG HÀM TỪ userAPI
        const res = await getMovieDetails(id as string);
        
        if (res.data?.data?.movie) {
          setMovie(res.data.data.movie);
        } else {
          message.error("Không tìm thấy dữ liệu phim!");
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết phim", error);
        message.error("Có lỗi xảy ra khi tải thông tin phim.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieDetails();
  }, [id]);

  // 2. Gọi API lịch chiếu
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!id) return;
      setLoadingShowtimes(true);
      try {
        // DÙNG HÀM TỪ userAPI
        const res = await getShowtimesByMovie(id as string, selectedDate);
        
        const fetchedShowtimes = res.data?.data?.showtimes || res.data?.data || [];
        setShowtimes(fetchedShowtimes);
      } catch (error) {
        console.error("Lỗi lấy lịch chiếu", error);
        setShowtimes([]);
      } finally {
        setLoadingShowtimes(false);
      }
    };

    fetchShowtimes();
  }, [id, selectedDate]);

  // 3. Gom nhóm lịch chiếu
  const groupedShowtimes = useMemo(() => {
    const groups: Record<string, Showtime[]> = {};
    showtimes.forEach(st => {
      const cinemaName = st.room?.cinema?.cinema_name || 'Rạp Khác';
      if (!groups[cinemaName]) groups[cinemaName] = [];
      groups[cinemaName].push(st);
    });
    
    Object.keys(groups).forEach(cinemaName => {
      groups[cinemaName].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    });

    return groups;
  }, [showtimes]);

  return {
    id, movie, loading,
    loadingShowtimes, selectedDate, setSelectedDate, dates, groupedShowtimes
  };
};