// src/app/Admin/pages/Users/type.ts

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id:          number;
  fullName:    string;
  email:       string;
  phoneNumber: string | null;
  avatarUrl:   string | null;
  role:        UserRole;
  createdAt:   string;
  updatedAt:   string;
}

export interface UserFilters {
  page?:   number;
  limit?:  number;
  role?:   UserRole | '';
  search?: string;
}

export interface Pagination {
  totalItems:  number;
  totalPages:  number;
  currentPage: number;
}