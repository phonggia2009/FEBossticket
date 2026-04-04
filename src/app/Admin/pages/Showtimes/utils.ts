import dayjs from 'dayjs';
import type { Showtime, ShowtimeStatus, ConflictInfo } from './type';
import { BUFFER_MINUTES, DATETIME_FORMAT } from './constants';

// ─── Status ───────────────────────────────────────────────────────────────────

export const getShowtimeStatus = (
  startTime: string,
  durationMin: number
): ShowtimeStatus => {
  const now   = dayjs();
  const start = dayjs(startTime);
  const end   = start.add(durationMin, 'minute');

  if (now.isBefore(start))  return 'upcoming';
  if (now.isBefore(end))    return 'ongoing';
  return 'ended';
};

// ─── Formatting ───────────────────────────────────────────────────────────────

export const formatVND = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDateTime = (isoString: string): string =>
  dayjs(isoString).format(DATETIME_FORMAT);

export const formatEndTime = (startTime: string, durationMin: number): string =>
  dayjs(startTime).add(durationMin, 'minute').format(DATETIME_FORMAT);

// ─── Conflict message ─────────────────────────────────────────────────────────

export const buildConflictMessage = (conflict: ConflictInfo): string => {
  const start = dayjs(conflict.start_time);
  const end   = start.add(conflict.duration + BUFFER_MINUTES, 'minute');
  return (
    `Phòng đã có suất chiếu "${conflict.movie_title}" ` +
    `lúc ${start.format(DATETIME_FORMAT)} – ${end.format('HH:mm')} ` +
    `(bao gồm ${BUFFER_MINUTES} phút dọn dẹp).`
  );
};

// ─── Group showtimes by date (dùng cho Calendar view) ────────────────────────

export const groupByDate = (
  showtimes: Showtime[]
): Record<string, Showtime[]> =>
  showtimes.reduce<Record<string, Showtime[]>>((acc, s) => {
    const key = dayjs(s.start_time).format('DD/MM/YYYY');
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

// ─── Disable past date for DatePicker ─────────────────────────────────────────

export const disablePastDate = (current: dayjs.Dayjs): boolean =>
  current && current.isBefore(dayjs().startOf('day'));