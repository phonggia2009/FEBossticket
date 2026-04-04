// src/app/Admin/pages/Booking/components/BookingDetailDrawer.tsx
import React from 'react';
import { Drawer, Descriptions, Table, Tag, Spin, Button, Space, Popconfirm, Select } from 'antd';
import dayjs from 'dayjs';
import type { Booking, TicketDetail, ProductDetail } from '../type';

interface Props {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  loading: boolean;
  onUpdateStatus: (id: number, status: string) => void;
  onForceCancel: (id: number) => void;
}

const BookingDetailDrawer: React.FC<Props> = ({ open, onClose, booking, loading, onUpdateStatus, onForceCancel }) => {
  if (!booking && !loading) return null;

  const ticketColumns = [
    { title: 'Hàng', dataIndex: ['seat', 'seat_row'], key: 'row' },
    { title: 'Số', dataIndex: ['seat', 'seat_number'], key: 'number' },
    { title: 'Loại ghế', dataIndex: ['seat', 'seat_type'], key: 'type' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (p: number) => `${p.toLocaleString('vi-VN')} đ` },
  ];

  const productColumns = [
    { title: 'Tên sản phẩm', dataIndex: ['product', 'product_name'], key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'qty' },
    { title: 'Giá/SP', dataIndex: 'price', key: 'price', render: (p: number) => `${p.toLocaleString('vi-VN')} đ` },
    { title: 'Tổng', key: 'total', render: (_: any, r: ProductDetail) => `${(r.price * r.quantity).toLocaleString('vi-VN')} đ` },
  ];

  return (
    <Drawer
      title={<span>Chi tiết đơn hàng <strong className="text-blue-600">#{booking?.booking_id}</strong></span>}
      width={700}
      open={open}
      onClose={onClose}
    >
      {loading ? (
        <div className="flex justify-center py-10"><Spin size="large" /></div>
      ) : (
        booking && (
          <div className="flex flex-col gap-6">
            {/* Hành động cập nhật */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
              <span className="font-semibold">Đổi trạng thái đơn:</span>
              <Space>
                <Select
                  value={booking.status}
                  style={{ width: 150 }}
                  onChange={(val) => onUpdateStatus(booking.booking_id, val)}
                  options={[
                    { value: 'PENDING', label: 'PENDING' },
                    { value: 'SUCCESS', label: 'SUCCESS' },
                    { value: 'CANCELLED', label: 'CANCELLED' }
                  ]}
                  disabled={booking.status === 'CANCELLED'} // Đã hủy thì không cho đổi lại dễ dàng
                />
                {booking.status !== 'CANCELLED' && (
                  <Popconfirm title="Ép hủy đơn này?" onConfirm={() => onForceCancel(booking.booking_id)}>
                    <Button danger>Hủy đơn ngay</Button>
                  </Popconfirm>
                )}
              </Space>
            </div>

            <Descriptions title="Thông tin khách hàng" bordered size="small" column={2}>
              <Descriptions.Item label="Họ tên">{booking.user?.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{booking.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{booking.user?.phoneNumber || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Thời gian đặt">{dayjs(booking.booking_time).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Thông tin suất chiếu" bordered size="small" column={2}>
              <Descriptions.Item label="Phim" span={2}><strong className="text-blue-600">{booking.showtime?.movie?.title}</strong></Descriptions.Item>
              <Descriptions.Item label="Rạp">{booking.showtime?.room?.cinema?.cinema_name}</Descriptions.Item>
              <Descriptions.Item label="Phòng">{booking.showtime?.room?.room_name}</Descriptions.Item>
              <Descriptions.Item label="Giờ chiếu" span={2}>
                <span className="text-red-600 font-bold">{dayjs(booking.showtime?.start_time).format('HH:mm - DD/MM/YYYY')}</span>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <h4 className="font-semibold mb-2">Danh sách Vé ({booking.tickets?.length || 0})</h4>
              <Table dataSource={booking.tickets} columns={ticketColumns} rowKey="ticket_id" pagination={false} size="small" bordered />
            </div>

            {booking.products && booking.products.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Dịch vụ đi kèm (Bắp/Nước)</h4>
                <Table dataSource={booking.products} columns={productColumns} rowKey="product_id" pagination={false} size="small" bordered />
              </div>
            )}

            <div className="text-right text-xl mt-4">
              Tổng thanh toán: <strong className="text-red-500">{booking.total_price?.toLocaleString('vi-VN')} VNĐ</strong>
            </div>
          </div>
        )
      )}
    </Drawer>
  );
};

export default BookingDetailDrawer;