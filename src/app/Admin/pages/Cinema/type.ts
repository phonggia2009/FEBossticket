// src/app/Admin/pages/Cinema/type.ts
import type { Room } from '../Room/type';
export interface Cinema {
  id: number;
  cinema_name: string;
  city?: string;
  address: string;
  phone?: string;
  rooms?: Room[];
}

export interface CinemaFormValues {
  cinema_name: string;
  city?: string;
  address: string;
  phone?: string;
}