// src/app/Admin/pages/Room/components/RoomTable.tsx

import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Room } from '../type';

interface Props {
  rooms: Room[];
  loading: boolean;
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
}

const RoomTable: React.FC<Props> = ({ rooms, loading, onEdit, onDelete }) => {
  const columns = [
    { 
      title: 'Tên phòng', 
      dataIndex: 'room_name', 
      key: 'room_name', 
      render: (text: string) => <strong>{text}</strong> 
    },
    { 
      title: 'Sức chứa', 
      dataIndex: 'capacity', 
      key: 'capacity', 
      render: (cap: number) => `${cap} ghế` 
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Room) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa phòng này?" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      dataSource={rooms} 
      columns={columns} 
      rowKey="id" 
      loading={loading}
      bordered
      locale={{ emptyText: 'Rạp này hiện chưa có phòng chiếu nào' }}
    />
  );
};

export default RoomTable;