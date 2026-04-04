// src/app/Admin/pages/Seat/types.ts

export type SeatType = 'NORMAL' | 'VIP' | 'COUPLE';

export interface Seat {
  id?: number;
  seat_row: string;      // 'A', 'B', ...
  seat_number: number;   // 1, 2, 3, ...
  seat_type: SeatType;
  room_id: number;
  _colIndex?: number;
}

export interface SeatTypeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}