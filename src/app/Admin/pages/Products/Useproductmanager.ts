// src/app/Admin/pages/Products/useProductManager.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import type { Product, ProductFilters, ProductFormValues, Pagination } from './type';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductAvailability,
} from '../../../../common/api/adminAPI';

interface ProductManagerState {
  products:   Product[];
  pagination: Pagination;
  loading:    boolean;
  filters:    ProductFilters;

  // Modal thêm/sửa
  modalOpen:  boolean;
  editTarget: Product | null;
  submitting: boolean;

  // Modal tồn kho
  stockModalOpen:  boolean;
  stockTarget:     Product | null;
}

const initialPagination: Pagination = {
  totalItems:  0,
  totalPages:  1,
  currentPage: DEFAULT_PAGE,
};

const initialFilters: ProductFilters = {
  page:  DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
};

export const useProductManager = () => {
  const [state, setState] = useState<ProductManagerState>({
    products:        [],
    pagination:      initialPagination,
    loading:         false,
    filters:         initialFilters,
    modalOpen:       false,
    editTarget:      null,
    submitting:      false,
    stockModalOpen:  false,
    stockTarget:     null,
  });

  const set = useCallback(
    (partial: Partial<ProductManagerState>) =>
      setState(prev => ({ ...prev, ...partial })),
    []
  );

  // ─── filtersRef tránh stale closure ────────────────────────────────────────
  const filtersRef = useRef<ProductFilters>(initialFilters);
  useEffect(() => { filtersRef.current = state.filters; }, [state.filters]);

  // ─── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (overrideFilters?: Partial<ProductFilters>) => {
    set({ loading: true });
    try {
      const params = { ...filtersRef.current, ...overrideFilters };
      const res    = await getProducts(params);

      const body       = res.data?.data ?? res.data;
      const products   = body?.products   ?? [];
      const pagination = body?.pagination ?? initialPagination;

      set({ products, pagination, filters: params });
    } catch {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      set({ loading: false });
    }
  }, []);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    fetchProducts({ page: DEFAULT_PAGE });
  }, [state.filters.type, state.filters.search, state.filters.isAvailable]);

  // ─── Filter actions ─────────────────────────────────────────────────────────
  const handleFilterChange = useCallback(
    (partial: Partial<ProductFilters>) =>
      set({ filters: { ...state.filters, ...partial, page: DEFAULT_PAGE } }),
    [state.filters]
  );

  const handleClearFilters = useCallback(() => set({ filters: initialFilters }), []);

  const handlePageChange = useCallback(
    (page: number) => fetchProducts({ page }),
    [fetchProducts]
  );

  // ─── Modal thêm/sửa ─────────────────────────────────────────────────────────
  const handleOpenCreate = useCallback(() => set({ modalOpen: true, editTarget: null }), []);
  const handleOpenEdit   = useCallback((p: Product) => set({ modalOpen: true, editTarget: p }), []);
  const handleCloseModal = useCallback(() => set({ modalOpen: false, editTarget: null }), []);

  // ─── Submit (tạo/sửa) dùng FormData vì có upload ảnh ───────────────────────
  const handleSubmit = useCallback(
    async (values: ProductFormValues, imageFile?: File) => {
      set({ submitting: true });
      try {
        const formData = new FormData();
        formData.append('product_name', values.product_name);
        formData.append('price',        String(values.price));
        formData.append('type',         values.type);
        formData.append('quantity',     String(values.quantity));
        formData.append('isAvailable',  String(values.isAvailable));
        if (values.description) formData.append('description', values.description);
        if (imageFile)          formData.append('image', imageFile);

        if (state.editTarget) {
          await updateProduct(state.editTarget.id, formData);
          message.success('Cập nhật sản phẩm thành công');
        } else {
          await createProduct(formData);
          message.success('Tạo sản phẩm thành công');
        }

        set({ modalOpen: false, editTarget: null });
        fetchProducts();
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Có lỗi xảy ra';
        message.error(msg);
      } finally {
        set({ submitting: false });
      }
    },
    [state.editTarget, fetchProducts]
  );

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async (product: Product) => {
    try {
      await deleteProduct(product.id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Xóa thất bại');
    }
  }, [fetchProducts]);

  // ─── Toggle availability ────────────────────────────────────────────────────
  const handleToggleAvailability = useCallback(async (product: Product) => {
    try {
      await toggleProductAvailability(product.id);
      message.success(`Đã ${product.isAvailable ? 'ẩn' : 'hiện'} sản phẩm`);
      fetchProducts();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Thao tác thất bại');
    }
  }, [fetchProducts]);

  // ─── Stock modal ────────────────────────────────────────────────────────────
  const handleOpenStockModal  = useCallback((p: Product) => set({ stockModalOpen: true, stockTarget: p }), []);
  const handleCloseStockModal = useCallback(() => set({ stockModalOpen: false, stockTarget: null }), []);

  const handleUpdateStock = useCallback(async (quantity: number) => {
    if (!state.stockTarget) return;
    set({ submitting: true });
    try {
      await updateProductStock(state.stockTarget.id, quantity);
      message.success('Cập nhật tồn kho thành công');
      set({ stockModalOpen: false, stockTarget: null });
      fetchProducts();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Cập nhật thất bại');
    } finally {
      set({ submitting: false });
    }
  }, [state.stockTarget, fetchProducts]);

  return {
    ...state,
    fetchProducts,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDeleteConfirm,
    handleToggleAvailability,
    handleOpenStockModal,
    handleCloseStockModal,
    handleUpdateStock,
  };
};