// src/app/Admin/pages/Point/usePointManager.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
// Bổ sung 2 hàm này vào file adminAPI của bạn
import { getAllPointHistoryAdmin, adjustPointsAdmin } from '../../../../common/api/adminAPI';
import type { PointHistory, UserBasic } from './type';

export const usePointManager = () => {
  const [histories, setHistories] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Phân trang & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({ user_id: '' });
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserBasic | null>(null);

  const fetchHistories = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAllPointHistoryAdmin(page, 15, filters);
      setHistories(res.data.data.histories);
      setTotalItems(res.data.data.pagination.totalItems);
      setCurrentPage(page);
    } catch {
      message.error('Không thể lấy lịch sử điểm');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistories(1); // Call khi load trang hoặc đổi filter
  }, [fetchHistories]);

  const handleSearchUserId = (value: string) => {
    setFilters({ user_id: value });
  };

  const handleTableChange = (pagination: any) => {
    fetchHistories(pagination.current);
  };

  const openAdjustModal = (user: UserBasic) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleAdjustPoints = async (values: { amount: number; reason: string }) => {
    if (!selectedUser) return;
    setAdjustLoading(true);
    try {
      await adjustPointsAdmin(selectedUser.id, values.amount, values.reason);
      message.success('Điều chỉnh điểm thành công');
      setModalOpen(false);
      fetchHistories(currentPage); // Refresh lại danh sách trang hiện tại
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi điều chỉnh điểm');
    } finally {
      setAdjustLoading(false);
    }
  };

  return {
    histories, loading, currentPage, totalItems,
    modalOpen, setModalOpen, adjustLoading, selectedUser,
    handleSearchUserId, handleTableChange, openAdjustModal, handleAdjustPoints
  };
};