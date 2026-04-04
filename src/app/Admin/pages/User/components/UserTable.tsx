// src/app/Admin/pages/Users/components/UserTable.tsx

import React from 'react';
import {
  Table, Tag, Avatar, Typography, Space,
  Button, Popconfirm, Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { User, Pagination } from '../type';
import { ROLE_LABELS, ROLE_COLORS } from '../constants';

const { Text } = Typography;

interface Props {
  users:          User[];
  pagination:     Pagination;
  loading:        boolean;
  onPageChange:   (page: number) => void;
  onEditRole:     (user: User) => void;
  onDelete:       (user: User) => void;
}

const UserTable: React.FC<Props> = ({
  users, pagination, loading,
  onPageChange, onEditRole, onDelete,
}) => {
  const columns: ColumnsType<User> = [
    {
      title: 'Người dùng',
      key:   'user',
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            src={record.avatarUrl}
            icon={<UserOutlined />}
            style={{ background: '#1677ff', flexShrink: 0 }}
          />
          <div>
            <div><Text strong>{record.fullName}</Text></div>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text></div>
          </div>
        </Space>
      ),
    },
    {
      title:     'Số điện thoại',
      dataIndex: 'phoneNumber',
      key:       'phoneNumber',
      render:    val => val ?? <Text type="secondary">—</Text>,
    },
    {
      title:  'Quyền',
      key:    'role',
      width:  150,
      render: (_, record) => (
        <Tag color={ROLE_COLORS[record.role]}>
          {ROLE_LABELS[record.role]}
        </Tag>
      ),
    },
    {
      title:     'Ngày tham gia',
      dataIndex: 'createdAt',
      key:       'createdAt',
      width:     160,
      render:    val => dayjs(val).format('DD/MM/YYYY HH:mm'),
    },
    {
      title:  'Thao tác',
      key:    'actions',
      width:  120,
      align:  'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Đổi quyền">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEditRole(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa người dùng"
            description={`Bạn có chắc muốn xóa "${record.fullName}"?`}
            onConfirm={() => onDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<User>
      rowKey="id"
      columns={columns}
      dataSource={users}
      loading={loading}
      pagination={{
        current:   pagination.currentPage,
        pageSize:  15,
        total:     pagination.totalItems,
        onChange:  onPageChange,
        showTotal: total => `Tổng ${total} người dùng`,
        showSizeChanger: false,
      }}
      scroll={{ x: 800 }}
    />
  );
};

export default UserTable;