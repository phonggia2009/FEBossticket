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

export interface Voucher {
  id: number;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  max_discount?: number | null; 
  min_order_value: number;
  usage_limit: number;
  used_count: number;
  start_date: string; // Trả về từ API thường là chuỗi ISO 8601
  end_date: string;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}