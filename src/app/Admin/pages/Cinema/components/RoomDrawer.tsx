// src/app/Admin/pages/Cinema/components/RoomDrawer.tsx

import React from 'react';
import { Drawer, Table, Button, Space, Popconfirm, Divider, Empty, Spin } from 'antd';
import { EnvironmentOutlined, PlusOutlined, OrderedListOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Cinema } from '../type';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCinema: Cinema | null;
  rooms: any[];
  loading: boolean;
  onAddRoom: () => void;
  onEditRoom: (room: any) => void;
  onDeleteRoom: (id: number) => void;
}

const RoomDrawer: React.FC<Props> = ({ 
  open, onClose, selectedCinema, rooms, loading, onAddRoom, onEditRoom, onDeleteRoom 
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'room_name',
      key: 'room_name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (cap: number) => `${cap} ghế`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            type="primary"
            ghost
            onClick={() => navigate(`/admin/rooms/${record.id}/seats`, { 
              state: { roomName: record.room_name, cinemaName: selectedCinema?.cinema_name } 
            })}
          >
            Ghế
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => onEditRoom(record)}>Sửa</Button>
          <Popconfirm title="Xóa phòng này?" onConfirm={() => onDeleteRoom(record.id)} okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-blue-500" />
          <span>Phòng chiếu — <span className="text-blue-600 font-bold">{selectedCinema?.cinema_name}</span></span>
        </div>
      }
      width={600}
      open={open}
      onClose={onClose}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={onAddRoom}>Thêm phòng</Button>}
    >
      {selectedCinema && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
          <EnvironmentOutlined className="mr-1" />{selectedCinema.address}
        </div>
      )}
      <Divider orientation="left" orientationMargin={0}>
        <span className="text-sm font-semibold text-gray-500">Danh sách phòng ({rooms.length})</span>
      </Divider>

      {loading ? (
        <div className="flex justify-center py-12"><Spin tip="Đang tải..." /></div>
      ) : rooms.length > 0 ? (
        <Table dataSource={rooms} columns={columns} rowKey="id" size="small" pagination={false} bordered />
      ) : (
        <Empty description="Chưa có phòng chiếu nào">
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddRoom}>Thêm phòng đầu tiên</Button>
        </Empty>
      )}
    </Drawer>
  );
};

export default RoomDrawer;