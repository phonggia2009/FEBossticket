// src/app/Admin/pages/Room/type.ts

export interface Cinema {
  id: number;
  cinema_name: string;
}

export interface Room {
  id: number;
  room_name: string;
  capacity: number;
  cinema_id: number;
}

export interface RoomFormValues {
  room_name: string;
  cinema_id: number;
}