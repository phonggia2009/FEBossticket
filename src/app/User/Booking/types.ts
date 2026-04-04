export interface Seat {
  id: number;
  seat_row: string;
  seat_number: number;
  seat_type: string; // NORMAL, VIP, COUPLE...
  isBooked: boolean;
  price: number;
}

export interface ShowtimeInfo {
  id: number;
  movie_title: string;
  posterUrl?: string;
  cinema_name: string;
  room_name: string;
  start_time: string;
  price: number;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface SelectedProduct extends Product {
  quantity: number;
}