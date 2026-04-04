import type { ShowtimeStatus } from './type';

// ─── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE      = 1;
export const DEFAULT_PAGE_SIZE = 5;
export const BUFFER_MINUTES    = 15; // Thời gian dọn dẹp giữa 2 suất chiếu

// ─── Status config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  ShowtimeStatus,
  { label: string; color: string; badgeStatus: 'processing' | 'success' | 'default' }
> = {
  upcoming: { label: 'Sắp chiếu',  color: 'blue',    badgeStatus: 'processing' },
  ongoing:  { label: 'Đang chiếu', color: 'green',   badgeStatus: 'success'    },
  ended:    { label: 'Đã chiếu',   color: 'default', badgeStatus: 'default'    },
};

// ─── Price format ─────────────────────────────────────────────────────────────

export const PRICE_STEP    = 5_000;
export const MIN_PRICE     = 30_000;
export const MAX_PRICE     = 500_000;

// ─── Date / time display ──────────────────────────────────────────────────────

export const DATE_FORMAT      = 'DD/MM/YYYY';
export const TIME_FORMAT      = 'HH:mm';
export const DATETIME_FORMAT  = 'DD/MM/YYYY HH:mm';
export const API_DATE_FORMAT  = 'YYYY-MM-DD';

// ─── Table columns key ────────────────────────────────────────────────────────

export const TABLE_COL = {
  INDEX:   'index',
  MOVIE:   'movie',
  ROOM:    'room',
  TIME:    'start_time',
  PRICE:   'price',
  STATUS:  'status',
  ACTION:  'action',
} as const;