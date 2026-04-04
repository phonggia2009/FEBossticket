// src/app/Admin/pages/Users/useUserManager.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import type { User, UserFilters, Pagination, UserRole } from './type';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../../../../common/api/adminAPI';

interface UserManagerState {
  users:      User[];
  pagination: Pagination;
  loading:    boolean;
  filters:    UserFilters;

  // Modal đổi role
  roleModalOpen: boolean;
  roleTarget:    User | null;
  submitting:    boolean;
}

const initialPagination: Pagination = {
  totalItems:  0,
  totalPages:  1,
  currentPage: DEFAULT_PAGE,
};

const initialFilters: UserFilters = {
  page:  DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
};

export const useUserManager = () => {
  const [state, setState] = useState<UserManagerState>({
    users:         [],
    pagination:    initialPagination,
    loading:       false,
    filters:       initialFilters,
    roleModalOpen: false,
    roleTarget:    null,
    submitting:    false,
  });

  const set = useCallback(
    (partial: Partial<UserManagerState>) =>
      setState(prev => ({ ...prev, ...partial })),
    []
  );

  // ─── filtersRef tránh stale closure ────────────────────────────────────────
  const filtersRef = useRef<UserFilters>(initialFilters);
  useEffect(() => {
    filtersRef.current = state.filters;
  }, [state.filters]);

  // ─── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (overrideFilters?: Partial<UserFilters>) => {
    set({ loading: true });
    try {
      const params = { ...filtersRef.current, ...overrideFilters };
      const res    = await getAllUsers(params);

      const body       = res.data?.data ?? res.data;
      const users      = body?.users      ?? [];
      const pagination = body?.pagination ?? initialPagination;

      set({ users, pagination, filters: params });
    } catch {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      set({ loading: false });
    }
  }, []);

  // Lần đầu mount
  useEffect(() => { fetchUsers(); }, []);

  // Tải lại khi filter thay đổi
  useEffect(() => {
    fetchUsers({ page: DEFAULT_PAGE });
  }, [state.filters.role, state.filters.search]);

  // ─── Filter actions ─────────────────────────────────────────────────────────
  const handleFilterChange = useCallback(
    (partial: Partial<UserFilters>) =>
      set({ filters: { ...state.filters, ...partial, page: DEFAULT_PAGE } }),
    [state.filters]
  );

  const handleClearFilters = useCallback(
    () => set({ filters: initialFilters }),
    []
  );

  const handlePageChange = useCallback(
    (page: number) => fetchUsers({ page }),
    [fetchUsers]
  );

  // ─── Modal đổi role ─────────────────────────────────────────────────────────
  const handleOpenRoleModal = useCallback(
    (user: User) => set({ roleModalOpen: true, roleTarget: user }),
    []
  );

  const handleCloseRoleModal = useCallback(
    () => set({ roleModalOpen: false, roleTarget: null }),
    []
  );

  const handleUpdateRole = useCallback(
    async (newRole: UserRole) => {
      if (!state.roleTarget) return;
      set({ submitting: true });
      try {
        await updateUserRole(state.roleTarget.id, newRole);
        message.success(`Đã cập nhật quyền thành ${newRole}`);
        set({ roleModalOpen: false, roleTarget: null });
        fetchUsers();
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Cập nhật quyền thất bại';
        message.error(msg);
      } finally {
        set({ submitting: false });
      }
    },
    [state.roleTarget, fetchUsers]
  );

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(
    async (user: User) => {
      try {
        await deleteUser(user.id);
        message.success('Xóa người dùng thành công');
        fetchUsers();
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Xóa thất bại';
        message.error(msg);
      }
    },
    [fetchUsers]
  );

  return {
    ...state,
    fetchUsers,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleOpenRoleModal,
    handleCloseRoleModal,
    handleUpdateRole,
    handleDeleteConfirm,
  };
};