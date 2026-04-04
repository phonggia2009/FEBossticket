// src/app/Admin/pages/Booking/type.ts

export interface UserBasic {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface TicketDetail {
  ticket_id: number;
  price: number;
  status: string;
  seat: {
    seat_row: string;
    seat_number: number;
    seat_type: string;
  };
}

export interface ProductDetail {
  product_id: number;
  quantity: number;
  price: number;
  product: {
    product_name: string;
    imageUrl?: string;
  };
}

export interface Booking {
  booking_id: number;
  total_price: number;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED';
  booking_time: string;
  user: UserBasic;
  showtime: {
    start_time: string;
    movie: { title: string; posterUrl?: string };
    room: { room_name: string; cinema?: { cinema_name: string } };
  };
  tickets?: TicketDetail[];
  products?: ProductDetail[];
}