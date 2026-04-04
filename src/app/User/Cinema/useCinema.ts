import { useState, useEffect, useMemo } from 'react';
import { getAllCinemasUser, getShowtimesByCinema } from '../../../common/api/userAPI';
import type { Cinema, GroupedShowtime, Showtime } from './type';
import { message } from 'antd';

export const useCinemas = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  
  // State quản lý Thành phố và Rạp được chọn
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [rawShowtimes, setRawShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  // 1. Fetch danh sách rạp khi vừa vào trang
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await getAllCinemasUser();
        const cinemaData = res.data?.data?.cinemas || res.data?.cinemas || [];
        setCinemas(cinemaData);
        
        // Trích xuất danh sách thành phố (loại bỏ trùng lặp)
        if (cinemaData.length > 0) {
          const uniqueCities = Array.from(new Set(cinemaData.map((c: Cinema) => c.city))).filter(Boolean) as string[];
          if (uniqueCities.length > 0) {
            setSelectedCity(uniqueCities[0]); // Mặc định chọn thành phố đầu tiên
          }
        }
      } catch (error) {
        message.error("Không thể tải danh sách rạp");
      } finally {
        setLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  // 2. Lấy danh sách các thành phố duy nhất để hiển thị dropdown
  const cities = useMemo(() => {
    return Array.from(new Set(cinemas.map(c => c.city))).filter(Boolean) as string[];
  }, [cinemas]);

  // 3. Lọc danh sách rạp theo thành phố đã chọn
  const filteredCinemas = useMemo(() => {
    if (!selectedCity) return [];
    return cinemas.filter(c => c.city === selectedCity);
  }, [cinemas, selectedCity]);

  // 4. Tự động chọn rạp đầu tiên khi người dùng đổi thành phố
  useEffect(() => {
    if (filteredCinemas.length > 0) {
      setSelectedCinemaId(filteredCinemas[0].id);
    } else {
      setSelectedCinemaId(null);
    }
  }, [selectedCity, filteredCinemas]);

  // 5. Fetch lịch chiếu khi đổi rạp hoặc đổi ngày
  useEffect(() => {
    if (!selectedCinemaId) {
      setRawShowtimes([]);
      return;
    }

    const fetchShowtimes = async () => {
      setLoadingShowtimes(true);
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const res = await getShowtimesByCinema(selectedCinemaId, formattedDate);
        setRawShowtimes(res.data?.data?.showtimes || res.data?.showtimes || []);
      } catch (error) {
        message.error("Lỗi lấy lịch chiếu");
        setRawShowtimes([]);
      } finally {
        setLoadingShowtimes(false);
      }
    };

    fetchShowtimes();
  }, [selectedCinemaId, selectedDate]);

  // 6. Xử lý dữ liệu: Nhóm suất chiếu theo phim
  const groupedShowtimes = useMemo(() => {
    const grouped: Record<number, GroupedShowtime> = {};

    rawShowtimes.forEach(st => {
      const movieId = st.movie?.id;
      if (!movieId) return;

      if (!grouped[movieId]) {
        grouped[movieId] = { movie: st.movie, showtimes: [] };
      }
      grouped[movieId].showtimes.push({
        id: st.id,
        start_time: st.start_time,
        room: st.room
      });
    });

    return Object.values(grouped);
  }, [rawShowtimes]);

  // 7. Tạo danh sách 7 ngày tiếp theo
  const dateOptions = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  return {
    cities,
    selectedCity,
    setSelectedCity,
    filteredCinemas,
    selectedCinemaId,
    setSelectedCinemaId,
    selectedDate,
    setSelectedDate,
    dateOptions,
    groupedShowtimes,
    loading,
    loadingShowtimes
  };
};