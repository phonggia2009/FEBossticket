// src/app/Admin/pages/Seat/utils.ts

import type { Seat, SeatType } from './type';
import { ROW_LABELS } from './constants';

/** Tạo key duy nhất cho một ghế */
export const seatKey = (s: Seat): string => `${s.seat_row}-${s.seat_number}`;

/** Sinh toàn bộ ghế NORMAL cho một phòng */
export const generateSeats = (rows: number, cols: number, roomId: number): Seat[] => {
  const seats: Seat[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seats.push({
        seat_row: ROW_LABELS[r],
        seat_number: c + 1,
        seat_type: 'NORMAL',
        room_id: roomId,
        _colIndex: c,
      });
    }
  }
  return seats;
};

/**
 * Áp dụng một SeatType lên tập ghế được chọn (theo key).
 * Với COUPLE: tự động thêm ghế partner cùng hàng.
 */
export const applyTypeToSeats = (
  seats: Seat[],
  keys: Set<string>,
  type: SeatType,
): Seat[] => {
  // Bước 1: áp type lên tất cả ghế trong keys
  let updated = seats.map(s =>
    keys.has(seatKey(s)) ? { ...s, seat_type: type } : s,
  );

  // Bước 2: nếu COUPLE, thêm partner chưa nằm trong keys
  if (type === 'COUPLE') {
    const partnerKeys = new Set<string>();
    updated.forEach(s => {
      if (keys.has(seatKey(s))) {
        const partnerCol =
          s._colIndex! % 2 === 0 ? s._colIndex! + 1 : s._colIndex! - 1;
        const partner = updated.find(
          p => p.seat_row === s.seat_row && p._colIndex === partnerCol,
        );
        if (partner) partnerKeys.add(seatKey(partner));
      }
    });
    updated = updated.map(s =>
      partnerKeys.has(seatKey(s)) ? { ...s, seat_type: type } : s,
    );
  }

  return updated;
};

/** Group ghế theo hàng và sắp xếp */
export const groupSeatsByRow = (
  seats: Seat[],
): { sortedRows: string[]; seatsByRow: Record<string, Seat[]> } => {
  const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, s) => {
    if (!acc[s.seat_row]) acc[s.seat_row] = [];
    acc[s.seat_row].push(s);
    return acc;
  }, {});
  const sortedRows = Object.keys(seatsByRow).sort();
  return { sortedRows, seatsByRow };
};

/** Đếm số ghế theo từng loại */
export const calcStats = (seats: Seat[]): Record<SeatType, number> =>
  seats.reduce<Record<SeatType, number>>(
    (acc, s) => { acc[s.seat_type]++; return acc; },
    { NORMAL: 0, VIP: 0, COUPLE: 0 },
  );