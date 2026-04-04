// src/app/Admin/pages/Cinema/components/CinemaTable.tsx

import React from 'react';
import { Table, Button, Space, Popconfirm, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { Cinema } from '../type';

interface Props {
  dataSource: Cinema[];
  loading: boolean;
  onEdit: (record: Cinema) => void;
  onDelete: (id: number) => void;
  onOpenRooms: (record: Cinema) => void;
}

const CinemaTable: React.FC<Props> = ({ dataSource, loading, onEdit, onDelete, onOpenRooms }) => {
  const columns = [
    {
      title: 'Tên rạp',
      dataIndex: 'cinema_name',
      key: 'cinema_name',
      render: (text: string) => <strong className="text-blue-600">{text}</strong>,
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      render: (city: string) => city || <span className="text-gray-400">Chưa cập nhật</span>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (addr: string) => (
        <span><EnvironmentOutlined className="mr-1 text-gray-400" />{addr}</span>
      ),
    },
    { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Phòng chiếu',
      dataIndex: 'rooms',
      key: 'rooms',
      align: 'center' as const,
      render: (rooms: any[]) => (
        <Badge
          count={rooms?.length || 0}
          showZero
          color={rooms?.length ? '#1677ff' : '#d9d9d9'}
          style={{ fontWeight: 600 }}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Cinema) => (
        <Space>
          <Button icon={<AppstoreOutlined />} onClick={() => onOpenRooms(record)}>
            Phòng chiếu
          </Button>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa rạp này?"
            description="Tất cả phòng chiếu thuộc rạp cũng sẽ bị xóa!"
            onConfirm={() => onDelete(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      loading={loading}
      bordered
      className="shadow-sm"
    />
  );
};

export default CinemaTable;