export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  banners: string[];
  duration: number | null;
  rating: number | null;
  genres: Genre[];
}

export interface Cinema {
  id: number;
  cinema_name: string;
}

export interface Room {
  id: number;
  room_name: string;
  cinema: Cinema; 
}

export interface Showtime {
  id: number;
  start_time: string;
  price: number;
  room: Room;
}
export interface UserBasic {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

export interface CommentType {
  id: number;
  user_id: number;
  movie_id: number;
  content: string;
  rating: number;
  createdAt: string;
  user: UserBasic;
}