
import axiosInstance from './axiosInstance';

/**
 * 1. Lấy danh sách phim (Dùng cho Trang chủ)
 */
// src/common/api/userAPI.ts
export const getMovies = (params: { page?: number, limit?: number, status?: string }) => {
  return axiosInstance.get('/movies', { params }); 
  // (Đường dẫn /movies có thể khác tùy thuộc vào router của bạn)
};
/**
 * 2. Lấy chi tiết một bộ phim
 * @param id ID của bộ phim
 */
export const getMovieDetails = (id: string | number) => {
  return axiosInstance.get(`/movies/${id}`);
};

export const searchMovies = (query: string) => 
  axiosInstance.get(`/movies/search?query=${query}`);
 //* 3. Lấy lịch chiếu của một phim theo ngày

export const getShowtimesByMovie = (movieId: string | number, date: string) => {
  return axiosInstance.get(`/showtimes/movie/${movieId}`, {
    params: { date },
  });
};

export const getShowtimeDetails = (showtimeId: string | number) => {
  return axiosInstance.get(`/showtimes/${showtimeId}`); 
};

export const createBooking = (data: {
  showtime_id: number;
  seat_ids: number[];
  products?: { product_id: number; quantity: number }[];
  payment_method: string;
  voucher_code?: string;
},) => {
  // Gắn token vào header Authorization
  return axiosInstance.post('/bookings', data);
};
export const checkVoucher = (data: { 
  code: string; 
  original_price: number; 
}) => {
  return axiosInstance.post('/vouchers/check', data);
};
export const getProducts = () => {
  return axiosInstance.get('/products');
};
export const getMe = () => {
  return axiosInstance.get('/users/profile'); 
};
export const getMyBookings = () => {
  return axiosInstance.get('/bookings/my-bookings');
};
export const retryPayment = (booking_id: number) => {
  return axiosInstance.post('/payments/create-vnpay-url', { booking_id });
};
export const cancelBooking = (bookingId: number) => {
  return axiosInstance.patch(`/bookings/${bookingId}/cancel`);
};
export const updateProfile = (data: { fullName?: string; phoneNumber?: string }) => {
  return axiosInstance.patch('/users/profile', data);
};
export const getMovieComments = (movieId: string, page = 1, limit = 10) => {
  return axiosInstance.get(`/comments/movie/${movieId}?page=${page}&limit=${limit}`);
};

export const checkCanComment = (movieId: string) => {
  return axiosInstance.get(`/comments/check/${movieId}`);
};

export const createComment = (data: { movieId: string, content: string, rating: number }) => {
  return axiosInstance.post(`/comments`, data);
};
export const getSuggestedVideos = () => {
  return axiosInstance.get('/movies/suggested-videos');
};
export const sendChatMessage = (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  return axiosInstance.post('/chatbot', { message, history });
};
// Lấy danh sách tất cả các rạp
export const getAllCinemasUser = () => {
  return axiosInstance.get('/cinemas');
};

// Lấy lịch chiếu theo rạp và ngày
export const getShowtimesByCinema = (cinemaId: number, date: string) => {
  return axiosInstance.get('/showtimes', {
    params: { cinemaId, date }
  });
};

export const getPersonalizedVideos = () => {
  return axiosInstance.get('/movies/personalized-suggestions');
};

