import { useState, useEffect } from 'react';
import { getMyBookings, retryPayment, cancelBooking } from '../../../common/api/userAPI';
import type { Booking, FilterType } from './type';

export const useMyOrders = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [payingId, setPayingId] = useState<number | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchBookings = () => {
    setLoading(true);
    getMyBookings()
      .then(res => setBookings(res.data?.data?.bookings ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const handleRetryPayment = async (bookingId: number) => {
    try {
      setPayingId(bookingId);
      const res = await retryPayment(bookingId);
      const paymentUrl = res.data?.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        console.warn('⚠️ Không có paymentUrl trong response!');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Không thể tạo link thanh toán, vui lòng thử lại!', 'error');
    } finally {
      setPayingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      setCancelingId(bookingId);
      await cancelBooking(bookingId);
      
      // Dùng alert mặc định thay cho antd message
      showToast('Đã hủy đơn đặt vé thành công!', 'success');
      
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.booking_id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi hủy đơn hàng!');
    } finally {
      setCancelingId(null);
    }
  };

  return {
    bookings,
    filteredBookings,
    loading,
    filter,
    setFilter,
    payingId,
    handleRetryPayment,
    cancelingId,
    handleCancelBooking,
    toast,
      setToast,
  };
};