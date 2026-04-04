// src/app/Admin/pages/Booking/useBookingManager.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
// Bạn cần import các hàm gọi API tương ứng từ file adminAPI của bạn
import { 
  getAllBookingsAdmin, 
  getBookingDetailAdmin, 
  forceCancelBooking, 
  updateBookingStatus 
} from '../../../../common/api/adminAPI';
import type { Booking } from './type';

export const useBookingManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', booking_id: '' });
  
  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBookingsAdmin(1, 50, filters); // Truyền page, limit, filters
      setBookings(res.data.data.bookings);
    } catch {
      message.error('Không thể lấy danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearchId = (value: string) => {
    setFilters(prev => ({ ...prev, booking_id: value }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const openDetailDrawer = async (bookingId: number) => {
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const res = await getBookingDetailAdmin(bookingId);
      setSelectedBooking(res.data.data.booking);
    } catch {
      message.error('Lỗi khi tải chi tiết đơn hàng');
      setDrawerOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleForceCancel = async (id: number) => {
    try {
      await forceCancelBooking(id);
      message.success('Hủy đơn hàng thành công');
      fetchBookings(); // Refresh danh sách
      if (selectedBooking?.booking_id === id) {
        setDrawerOpen(false); // Đóng drawer nếu đang mở
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi hủy đơn');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status);
      message.success('Cập nhật trạng thái thành công');
      fetchBookings();
      if (selectedBooking?.booking_id === id) {
        openDetailDrawer(id); // Reload lại chi tiết
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return {
    bookings, loading, filters, 
    drawerOpen, setDrawerOpen, selectedBooking, detailLoading,
    handleSearchId, handleStatusChange, openDetailDrawer, 
    handleForceCancel, handleUpdateStatus, fetchBookings
  };
};