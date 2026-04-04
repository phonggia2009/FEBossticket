// src/app/Admin/pages/Products/constants.ts

export const DEFAULT_PAGE      = 1;
export const DEFAULT_PAGE_SIZE = 15;

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  FOOD:  'Đồ ăn',
  DRINK: 'Đồ uống',
  COMBO: 'Combo',
};

export const PRODUCT_TYPE_COLORS: Record<string, string> = {
  FOOD:  'orange',
  DRINK: 'cyan',
  COMBO: 'purple',
};

export const PRODUCT_TYPE_ICONS: Record<string, string> = {
  FOOD:  '🍿',
  DRINK: '🥤',
  COMBO: '🎁',
};