import type { ProductFilters } from '../../app/Admin/pages/Products/type';
import type { UserFilters } from '../../app/Admin/pages/User/type';
import type { SeatTypeName } from '../../app/Admin/pages/Showtimes/type';
import axiosInstance from './axiosInstance';

// API Thể loại
export const getGenres = () => axiosInstance.get('/genres');
export const createGenre = (name: string) => axiosInstance.post('/genres', { name });
export const updateGenre = (id: number, name: string) => axiosInstance.put(`/genres/${id}`, { name });
export const deleteGenre = (id: number) => axiosInstance.delete(`/genres/${id}`);

// API Phim (Lưu ý: Thêm/Sửa phim dùng FormData vì có ảnh)
export const getMovies = (page = 1, limit = 5) => 
  axiosInstance.get(`/movies`, { params: { page, limit } });
export const createMovie = (formData: FormData) => axiosInstance.post('/movies', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateMovie = (id: number, formData: FormData) => axiosInstance.put(`/movies/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteMovie = (id: number) => axiosInstance.delete(`/movies/${id}`);
export const searchMovies = (query: string) => 
  axiosInstance.get(`/movies/search?query=${query}`);
export const getMovieTrash = () => axiosInstance.get('/movies/trash');
// Khôi phục phim từ thùng rác
export const restoreMovie = (id: number) => axiosInstance.patch(`/movies/restore/${id}`);

// API Quản lý Rạp
export const getAllCinemas = () => axiosInstance.get('/cinemas');
export const searchCinemas = (query: string) => axiosInstance.get(`/cinemas/search?query=${query}`);
export const createCinema = (data: any) => axiosInstance.post('/cinemas', data);
export const updateCinema = (id: number, data: any) => axiosInstance.put(`/cinemas/${id}`, data);
export const deleteCinema = (id: number) => axiosInstance.delete(`/cinemas/${id}`);

// src/common/api/adminAPI.ts

// API Quản lý Phòng
export const getAllRooms = () => axiosInstance.get('/rooms');
export const getRoomsByCinema = (cinemaId: number) => axiosInstance.get(`/rooms/cinema/${cinemaId}`);
export const createRoom = (data: { cinema_id: number; room_name: string; capacity: number }) => 
  axiosInstance.post('/rooms', data);
export const updateRoom = (id: number, data: { room_name: string; capacity: number }) => 
  axiosInstance.put(`/rooms/${id}`, data);
export const deleteRoom = (id: number) => axiosInstance.delete(`/rooms/${id}`);
export const getSeatsByRoom = (roomId: number) =>
  axiosInstance.get(`/seats/room/${roomId}`);
export const bulkCreateSeats = (
  roomId: number,
  seats: {
    seat_row: string;
    seat_number: number;
    seat_type: 'NORMAL' | 'VIP' | 'COUPLE';
    room_id: number;
  }[]
) => axiosInstance.post(`/seats/room/${roomId}/bulk`, { seats });
export const deleteAllSeats = (roomId: number) =>
  axiosInstance.delete(`/seats/room/${roomId}`);
 
export const updateSeatType = (
  seatId: number,
  seat_type: 'NORMAL' | 'VIP' | 'COUPLE'
) => axiosInstance.patch(`/seats/${seatId}`, { seat_type });

// API Quản lý Lịch chiếu
export const getShowtimes = (params?: {
  movieId?:  number;
  cinemaId?: number;
  roomId?:   number;
  date?:     string;   // YYYY-MM-DD
  page?:     number;
  limit?:    number;
}) => axiosInstance.get('/showtimes', { params });

export const getShowtimeById = (id: number) =>
  axiosInstance.get(`/showtimes/${id}`);

export const createShowtime = (data: {
  movie_id:   number;
  room_id:    number;
  start_time: string; // ISO string
  seat_prices: { seat_type: SeatTypeName; price: number }[];
}) => axiosInstance.post('/showtimes', data);

export const updateShowtime = (id: number, data: {
  movie_id?:   number;
  room_id?:    number;
  start_time?: string;
 seat_prices: { seat_type: SeatTypeName; price: number }[];
}) => axiosInstance.put(`/showtimes/${id}`, data);

export const deleteShowtime = (id: number) =>
  axiosInstance.delete(`/showtimes/${id}`);

export const getShowtimesByMovie = (movieId: number) =>
  axiosInstance.get(`/showtimes/movie/${movieId}`);

export const getShowtimesByRoom = (roomId: number, date?: string) =>
  axiosInstance.get(`/showtimes/room/${roomId}`, { params: { date } });

export const checkShowtimeConflict = (data: {
  movie_id:    number;
  room_id:     number;
  start_time:  string;
  exclude_id?: number; // truyền khi đang sửa để bỏ qua chính nó
}) => axiosInstance.post('/showtimes/check-conflict', data);

export const getAllUsers = (params?: UserFilters) =>
  axiosInstance.get('/users', { params });

export const updateUserRole = (id: number, role: 'ADMIN' | 'USER') =>
  axiosInstance.patch(`/users/${id}/role`, { role });

export const deleteUser = (id: number) =>
  axiosInstance.delete(`/users/${id}`);

export const getProducts              = (params?: ProductFilters) => axiosInstance.get('/products', { params });
export const createProduct            = (data: FormData) => axiosInstance.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct            = (id: number, data: FormData) => axiosInstance.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct            = (id: number) => axiosInstance.delete(`/products/${id}`);
export const updateProductStock       = (id: number, quantity: number) => axiosInstance.patch(`/products/${id}/stock`, { quantity });
export const toggleProductAvailability = (id: number) => axiosInstance.patch(`/products/${id}/toggle`);
export const getAllBookingsAdmin = (page = 1, limit = 15, filters = {}) => {
  return axiosInstance.get('bookings/admin', { params: { page, limit, ...filters } });
};
export const getBookingDetailAdmin = (id: number) => axiosInstance.get(`bookings/admin/${id}`);
export const forceCancelBooking = (id: number) => axiosInstance.put(`bookings/admin/${id}/cancel`);
export const updateBookingStatus = (id: number, status: string) => axiosInstance.patch(`bookings/admin/${id}/status`, { status });
export const getDashboardStats = () => {
  return axiosInstance.get('/dashboard');
};
// ==========================================
// API Quản lý Mã giảm giá (Voucher) - ADMIN
// ==========================================

export const getAllVouchers = () => {
  return axiosInstance.get('/vouchers');
};

export const createVoucher = (data: FormData) => {
  return axiosInstance.post('/vouchers', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const toggleVoucherStatus = (id: number) => {
  return axiosInstance.patch(`/vouchers/${id}/toggle`);
};
export const checkInBookingApi = (data: { booking_id: string | number }) => {
  return axiosInstance.post('/bookings/admin/checkin', data);
};
// Thêm vào adminAPI.ts
export const getAllPointHistoryAdmin = (page: number, limit: number, filters: any) => {
  return axiosInstance.get(`/users/admin/history`, { params: { page, limit, ...filters } });
};

export const adjustPointsAdmin = (userId: number, amount: number, reason: string) => {
  return axiosInstance.post(`/users/admin/${userId}/adjust-points`, { amount, reason });
};
export const settingAPI = {
  getSettings: () => axiosInstance.get('/settings'),
  updateSettings: (data: any) => axiosInstance.put('/settings', data),
};