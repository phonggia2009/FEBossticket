export interface Seat { 
  seat_row: string; 
  seat_number: number; 
  seat_type: string; 
}

export interface Ticket { 
  id: number; 
  price: number; 
  status: string; 
  seat: Seat; 
}

export interface BookingItem {
  id: number;
  quantity: number;
  price: number;
  product: { product_name: string; imageUrl: string };
}

export type BookingStatus = 'PENDING' | 'SUCCESS' | 'EXPIRED' | 'CANCELLED'|'USED';

export interface Booking {
  booking_id: number;
  status: BookingStatus;
  total_price: number;
  booking_time: string;
  showtime: {
    start_time: string;
    movie: { title: string; posterUrl: string };
    room: { room_name: string; cinema: { cinema_name: string } };
  };
  tickets: Ticket[];
  products: BookingItem[];
}

export type FilterType = 'ALL' | BookingStatus;