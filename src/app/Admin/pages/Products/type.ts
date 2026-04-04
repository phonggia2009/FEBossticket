// src/app/Admin/pages/Products/type.ts

export type ProductType = 'FOOD' | 'DRINK' | 'COMBO';

export interface Product {
  id:           number;
  product_name: string;
  price:        number;
  type:         ProductType;
  quantity:     number;
  imageUrl:     string | null;
  description:  string | null;
  isAvailable:  boolean;
  createdAt:    string;
  updatedAt:    string;
}

export interface ProductFormValues {
  product_name: string;
  price:        number;
  type:         ProductType;
  quantity:     number;
  description?: string;
  isAvailable:  boolean;
  image?:       any; // Upload file từ Ant Design
}

export interface ProductFilters {
  page?:        number;
  limit?:       number;
  type?:        ProductType | '';
  search?:      string;
  isAvailable?: string; // 'true' | 'false' | ''
}

export interface Pagination {
  totalItems:  number;
  totalPages:  number;
  currentPage: number;
}