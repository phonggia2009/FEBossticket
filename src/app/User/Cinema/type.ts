export interface Cinema {
  id: number;
  cinema_name: string;
  address: string;
  city: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  duration: number;
  rating?: string;
}

export interface Showtime {
  id: number;
  start_time: string;
  room: {
    id: number;
    room_name: string;
  };
}

// Kiểu dữ liệu sau khi đã nhóm các suất chiếu theo từng bộ phim
export interface GroupedShowtime {
  movie: Movie;
  showtimes: Showtime[];
}