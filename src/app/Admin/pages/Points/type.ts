// src/app/Admin/pages/Point/type.ts

export interface UserBasic {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  points?: number;
}

export interface PointHistory {
  id: number;
  user_id: number;
  change_amount: number;
  balance_after: number;
  reason: string;
  createdAt: string;
  user?: UserBasic;
}