import React, { useState } from 'react';
import {
  Table, Tag, Badge, Typography, Space, Button, Popconfirm,
  Avatar, Tooltip, Pagination, message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Showtime, Pagination as PaginationType } from '../type';
import { STATUS_CONFIG, DEFAULT_PAGE_SIZE } from '../constants';
import {
  getShowtimeStatus,
  formatVND,
  formatDateTime,
  formatEndTime,
} from '../utils';

const { Text } = Typography;

interface Props {
  showtimes:   Showtime[];
  pagination:  PaginationType;
  loading:     boolean;
  onEdit:      (record: Showtime) => void;
  onDelete:    (record: Showtime) => Promise<void>; // ← đổi void → Promise<void>
  onPageChange:(page: number) => void;
}

const ShowtimeTable: React.FC<Props> = ({
  showtimes,
  pagination,
  loading,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (record: Showtime) => {
    setDeletingId(record.id);
    try {
      await onDelete(record);
    } finally {
      setDeletingId(null);
    }
  };
  const columns: ColumnsType<Showtime> = [
    {
      title: '#',
      key: 'index',
      width: 56,
      align: 'center',
      render: (_, __, index) =>
        (pagination.currentPage - 1) * DEFAULT_PAGE_SIZE + index + 1,
    },
    {
      title: 'Phim',
      key: 'movie',
      render: (_, record) => (
        <Space>
          {record.movie?.posterUrl ? (
            <Avatar
              shape="square"
              size={42}
              src={record.movie.posterUrl}
              style={{ borderRadius: 6, flexShrink: 0 }}
            />
          ) : (
            <Avatar shape="square" size={42} style={{ borderRadius: 6, background: '#f0f0f0' }}>
              🎬
            </Avatar>
          )}
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 13 }}>
              {record.movie?.title ?? '—'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.movie?.duration} phút
              {record.movie?.rating ? ` · ⭐ ${record.movie.rating}` : ''}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Rạp / Phòng',
      key: 'room',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>
            {record.room?.cinema?.cinema_name ?? '—'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.room?.room_name}
            {record.room?.cinema?.city ? ` · ${record.room.cinema.city}` : ''}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Giờ chiếu',
      dataIndex: 'start_time',
      key: 'start_time',
      sorter: (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      render: (val, record) => (
        <Space direction="vertical" size={0}>
          <Space size={4}>
            <ClockCircleOutlined style={{ color: '#1677ff', fontSize: 13 }} />
            <Text strong style={{ fontSize: 13 }}>{formatDateTime(val)}</Text>
          </Space>
          {record.movie?.duration && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Kết thúc: {formatEndTime(val, record.movie.duration)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        if (!record.movie?.duration) return null;
        const status = getShowtimeStatus(record.start_time, record.movie.duration);
        const cfg    = STATUS_CONFIG[status];
        return (
          <Badge status={cfg.badgeStatus} text={<Tag color={cfg.color}>{cfg.label}</Tag>} />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ color: '#1677ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa lịch chiếu"
            description={`Xóa suất "${record.movie?.title}" lúc ${formatDateTime(record.start_time)}?`}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={showtimes}
        loading={loading}
        pagination={false}
        size="middle"
        scroll={{ x: 900 }}
        locale={{ emptyText: 'Không có lịch chiếu nào' }}
        rowClassName={(_, index) => (index % 2 === 0 ? '' : 'ant-table-row-striped')}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination
          current={pagination.currentPage}
          total={pagination.totalItems}
          pageSize={DEFAULT_PAGE_SIZE}
          showSizeChanger={false}
          showTotal={(total) => `Tổng ${total} suất chiếu`}
          onChange={onPageChange}
        />
      </div>
    </>
  );
};

export default ShowtimeTable;