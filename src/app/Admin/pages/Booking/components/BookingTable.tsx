// src/app/Admin/pages/Booking/components/BookingTable.tsx
import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EyeOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Booking } from '../type';

interface Props {
  dataSource: Booking[];
  loading: boolean;
  onViewDetail: (id: number) => void;
  onCancel: (id: number) => void;
}

const BookingTable: React.FC<Props> = ({ dataSource, loading, onViewDetail, onCancel }) => {
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <Tag color="green">THÀNH CÔNG</Tag>;
      case 'PENDING': return <Tag color="orange">CHỜ THANH TOÁN</Tag>;
      case 'CANCELLED': return <Tag color="red">ĐÃ HỦY</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 'booking_id',
      key: 'booking_id',
      render: (id: number) => <strong className="text-blue-600">#{id}</strong>,
    },
    {
      title: 'Khách hàng',
      key: 'user',
      render: (_: any, record: Booking) => (
        <div>
          <div className="font-semibold">{record.user?.fullName}</div>
          <div className="text-gray-500 text-xs">{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Phim',
      key: 'movie',
      render: (_: any, record: Booking) => record.showtime?.movie?.title || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price: number) => <span className="font-bold text-red-500">{price?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Thời gian đặt',
      dataIndex: 'booking_time',
      key: 'booking_time',
      render: (time: string) => dayjs(time).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Booking) => (
        <Space>
          <Button type="primary" ghost icon={<EyeOutlined />} onClick={() => onViewDetail(record.booking_id)}>
            Chi tiết
          </Button>
          {record.status !== 'CANCELLED' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này?"
              description="Hành động này sẽ nhả ghế và hoàn số lượng bắp nước."
              onConfirm={() => onCancel(record.booking_id)}
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<StopOutlined />}>Hủy</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="booking_id"
      loading={loading}
      bordered
      className="shadow-sm"
    />
  );
};

export default BookingTable;