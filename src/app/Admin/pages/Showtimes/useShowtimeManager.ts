import { useState, useEffect, useCallback,useRef } from 'react';
import { message, App } from 'antd';
import dayjs from 'dayjs';
import type {
  Showtime,
  ShowtimeFilters,
  ShowtimeFormValues,
  Pagination,
  ViewMode,
  Movie,
  Cinema,
  Room,
} from './type';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';

// ─── Import trực tiếp từ adminAPI ────────────────────────────────────────────
import {
  getShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from '../../../../common/api/adminAPI';
import {
  getMovies,
  getAllCinemas,
  getRoomsByCinema,
} from '../../../../common/api/adminAPI';

interface ShowtimeManagerState {
  // Data
  showtimes:    Showtime[];
  movies:       Movie[];
  cinemas:      Cinema[];
  pagination:   Pagination;

  // UI state
  loading:      boolean;
  viewMode:     ViewMode;

  // Modal state
  modalOpen:    boolean;
  editTarget:   Showtime | null;
  submitting:   boolean;

  // Filters
  filters:      ShowtimeFilters;
}

const initialPagination: Pagination = {
  totalItems:  0,
  totalPages:  1,
  currentPage: DEFAULT_PAGE,
};

const initialFilters: ShowtimeFilters = {
  page:  DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useShowtimeManager = () => {
  const { message: msg } = App.useApp(); // ← dùng hook thay static message
  const [state, setState] = useState<ShowtimeManagerState>({
    showtimes:  [],
    movies:     [],
    cinemas:    [],
    pagination: initialPagination,
    loading:    false,
    viewMode:   'table',
    modalOpen:  false,
    editTarget: null,
    submitting: false,
    filters:    initialFilters,
  });

  const set = useCallback(
    (partial: Partial<ShowtimeManagerState>) =>
      setState(prev => ({ ...prev, ...partial })),
    []
  );


  useEffect(() => {
    Promise.all([
      getMovies(1, 200),
      getAllCinemas(),
    ])
      .then(([moviesRes, cinemasRes]) => {
        // --- SỬA LOGIC LẤY DATA PHIM Ở ĐÂY ---
        const moviesData = moviesRes.data?.data;
        // Bắt mọi trường hợp: nằm trong moviesData trực tiếp (mảng) hoặc nằm trong moviesData.movies
        const movies = Array.isArray(moviesData) 
          ? moviesData 
          : (moviesData?.movies ?? moviesRes.data?.movies ?? []);

        const rawCinemas = cinemasRes.data?.data?.cinemas 
          ?? (Array.isArray(cinemasRes.data?.data) ? cinemasRes.data.data : cinemasRes.data);
        const cinemas    = Array.isArray(rawCinemas) ? rawCinemas : [];

        set({ movies, cinemas });
      })
      .catch(() => msg.error('Không thể tải danh sách phim / rạp'));
  }, []);

  const filtersRef = useRef<ShowtimeFilters>(initialFilters);
  useEffect(() => {
    filtersRef.current = state.filters;
  }, [state.filters]);

  const fetchShowtimes = useCallback(
    async (overrideFilters?: Partial<ShowtimeFilters>) => {
      set({ loading: true });
      try {
        const params = { ...filtersRef.current, ...overrideFilters }; // ✅ luôn mới nhất
        const res    = await getShowtimes(params);


        const body       = res.data?.data ?? res.data;
        const showtimes  = body?.showtimes  ?? [];
        const pagination = body?.pagination ?? initialPagination;

        set({ showtimes, pagination, filters: params });
      } catch {
        msg.error('Không thể tải danh sách lịch chiếu');
      } finally {
        set({ loading: false });
      }
    },
    [] 
  );

  // Tải lại khi filter thay đổi (reset về trang 1)
  useEffect(() => {
    fetchShowtimes({ page: DEFAULT_PAGE });
  }, [state.filters.movieId, state.filters.cinemaId, state.filters.date]);

  // Lần đầu mount
  useEffect(() => {
    fetchShowtimes();
  }, []);

  // ─── Rooms: load theo cinemaId (dùng trong Modal) ──────────────────────────
  // getRoomsByCinema(cinemaId) — trả về rooms của rạp đó

  const fetchRoomsByCinema = useCallback(
    async (cinemaId: number): Promise<Room[]> => {
      try {
        const res   = await getRoomsByCinema(cinemaId);
        const rooms = res.data?.data ?? res.data?.rooms ?? [];
        return rooms;
      } catch {
        msg.error('Không thể tải danh sách phòng');
        return [];
      }
    },
    []
  );

  // ─── Filter actions ─────────────────────────────────────────────────────────

  const handleFilterChange = useCallback(
    (partial: Partial<ShowtimeFilters>) =>
      set({ filters: { ...state.filters, ...partial, page: DEFAULT_PAGE } }),
    [state.filters]
  );

  const handleClearFilters = useCallback(
    () => set({ filters: initialFilters }),
    []
  );

  const handlePageChange = useCallback(
    (page: number) => fetchShowtimes({ page }),
    [fetchShowtimes]
  );

  // ─── Modal actions ──────────────────────────────────────────────────────────

  const handleOpenCreate = useCallback(
    () => set({ modalOpen: true, editTarget: null }),
    []
  );

  const handleOpenEdit = useCallback(
    (record: Showtime) => set({ modalOpen: true, editTarget: record }),
    []
  );

  const handleCloseModal = useCallback(
    () => set({ modalOpen: false, editTarget: null }),
    []
  );

  // ─── Submit: create hoặc update ────────────────────────────────────────────
  // createShowtime({ movie_id, room_id, start_time, price })
  // updateShowtime(id, { movie_id?, room_id?, start_time?, price? })

  const handleSubmit = useCallback(
    async (values: ShowtimeFormValues) => {
      set({ submitting: true });
      try {
        const payload = {
          movie_id:   values.movie_id,
          room_id:    values.room_id,
          start_time: dayjs(values.start_time).toISOString(),
            seat_prices: values.seat_prices.map(sp => ({
              seat_type: sp.seat_type,
              price:     Number(sp.price),
            })),
        };

        if (state.editTarget) {
          await updateShowtime(state.editTarget.id, payload);
          msg.success('Cập nhật lịch chiếu thành công');
        } else {
          await createShowtime(payload);
          msg.success('Thêm lịch chiếu thành công');
        }

        set({ modalOpen: false, editTarget: null });
        fetchShowtimes();
      } catch (err: any) {
        const errMsg = err?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại';
        msg.error(errMsg);
      } finally {
        set({ submitting: false });
      }
    },
    [state.editTarget, fetchShowtimes]
  );


    const handleDeleteConfirm = useCallback(
    async (record: Showtime) => {
      try {
        await deleteShowtime(record.id);
        msg.success('Xóa lịch chiếu thành công');
        fetchShowtimes();
      } catch (err: any) {
        const errMsg = err?.response?.data?.message ?? 'Xóa thất bại, vui lòng thử lại';
        msg.error(errMsg, 4);
        throw err;
      }
    },
    [fetchShowtimes]
  );


  const handleViewModeChange = useCallback(
    (mode: ViewMode) => set({ viewMode: mode }),
    []
  );
  return {
    ...state,
    // actions
    fetchShowtimes,
    fetchRoomsByCinema,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDeleteConfirm,
    handleViewModeChange,
  };
};