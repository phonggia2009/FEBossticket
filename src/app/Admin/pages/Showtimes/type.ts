// ─── Showtime Types ───────────────────────────────────────────────────────────

export type SeatTypeName = 'NORMAL' | 'VIP' | 'COUPLE';

export interface ShowtimeSeatPrice {
  seat_type: SeatTypeName;
  price: number;
}

export interface Movie {
  id: number;
  title: string;
  duration: number;
  posterUrl?: string;
  rating?: number;
}

export interface Cinema {
  id: number;
  cinema_name: string;
  city: string;
  address?: string;
}

export interface Room {
  id: number;
  room_name: string;
  capacity: number;
  cinema?: Cinema;
}

export interface Showtime {
  id: number;
  start_time: string;        // ISO string
  price: number;
  movie_id: number;
  room_id: number;
  movie?: Movie;
  room?: Room;
  createdAt?: string;
  updatedAt?: string;
  seat_prices: ShowtimeSeatPrice[];
}

// ─── Request / Response shapes ────────────────────────────────────────────────

export interface ShowtimeFormValues {
  movie_id: number;
  cinema_id: number;
  room_id: number;
  start_time: string;        // ISO string từ DatePicker
  seat_prices: {
    seat_type: SeatTypeName;
    price: number;
  }[];
}

export interface ConflictInfo {
  showtime_id: number;
  movie_title: string;
  start_time: string;
  duration: number;
}

export interface ConflictResponse {
  hasConflict: boolean;
  conflict: ConflictInfo | null;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ShowtimeListResponse {
  showtimes: Showtime[];
  pagination: Pagination;
}

// ─── Filter / Query ────────────────────────────────────────────────────────────

export type ShowtimeStatus = 'upcoming' | 'ongoing' | 'ended';

export interface ShowtimeFilters {
  movieId?: number;
  cinemaId?: number;
  roomId?: number;
  date?: string;             // YYYY-MM-DD
  page?: number;
  limit?: number;
}

export type ViewMode = 'table' | 'calendar';

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