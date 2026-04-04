// src/app/Admin/pages/Seat/constants.ts

import type { SeatType } from './type'
import type { SeatTypeConfig } from './type'

export const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const SEAT_TYPE_CONFIG: Record<SeatType, SeatTypeConfig> = {
  NORMAL: { label: 'Thường', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
  VIP:    { label: 'VIP',    color: '#b45309', bg: '#fef3c7', border: '#f59e0b' },
  COUPLE: { label: 'Couple', color: '#7c3aed', bg: '#ede9fe', border: '#8b5cf6' },
};

export const ALL_SEAT_TYPES: SeatType[] = ['NORMAL', 'VIP', 'COUPLE'];