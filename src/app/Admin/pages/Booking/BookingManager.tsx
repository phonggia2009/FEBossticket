// src/app/Admin/pages/Booking/BookingManager.tsx
import { Card, Select, Input } from 'antd';
import { useBookingManager } from './useBookingManager';
import BookingTable from './components/BookingTable';
import BookingDetailDrawer from './components/BookingDetailDrawer';

const { Search } = Input;

const BookingManager = () => {
  const {
    bookings, loading, 
    drawerOpen, setDrawerOpen, selectedBooking, detailLoading,
    handleSearchId, handleStatusChange, openDetailDrawer, 
    handleForceCancel, handleUpdateStatus
  } = useBookingManager();

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Quản lý Đơn hàng (Bookings)</h2>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Trạng thái:</span>
            <Select
              style={{ width: 180 }}
              placeholder="Tất cả trạng thái"
              allowClear
              onChange={handleStatusChange}
              options={[
                { value: 'SUCCESS', label: 'THÀNH CÔNG (SUCCESS)' },
                { value:'USED', label: 'ĐÃ SỬ DỤNG (USED)' },
                { value: 'PENDING', label: 'CHỜ THANH TOÁN' },
                { value: 'CANCELLED', label: 'ĐÃ HỦY' },
                { value: 'NO_SHOW', label: 'KHÔNG ĐẾN' },
                { value: 'EXPIRED', label: 'HẾT HẠN' }
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Mã đơn hàng:</span>
            <Search 
              placeholder="Nhập mã đơn (Booking ID)..." 
              allowClear 
              onSearch={handleSearchId} 
              style={{ width: 250 }} 
            />
          </div>
        </div>
      </Card>

      {/* Bảng dữ liệu */}
      <BookingTable 
        dataSource={bookings} 
        loading={loading} 
        onViewDetail={openDetailDrawer}
        onCancel={handleForceCancel}
      />

      {/* Drawer Chi tiết */}
      <BookingDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        booking={selectedBooking}
        loading={detailLoading}
        onForceCancel={handleForceCancel}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default BookingManager;