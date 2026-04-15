// src/app/Admin/pages/Point/components/PointHistoryTable.tsx
import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { PointHistory, UserBasic } from '../type';

interface Props {
  dataSource: PointHistory[];
  loading: boolean;
  currentPage: number;
  totalItems: number;
  onTableChange: (pagination: any) => void;
  onAdjustClick: (user: UserBasic) => void;
}

const PointHistoryTable: React.FC<Props> = ({ 
  dataSource, loading, currentPage, totalItems, onTableChange, onAdjustClick 
}) => {
  
  const columns = [
    {
      title: 'Khách hàng',
      key: 'user',
      render: (_: any, record: PointHistory) => (
        <div>
          <div className="font-semibold">{record.user?.fullName} <span className="text-gray-400 text-xs">(ID: {record.user_id})</span></div>
          <div className="text-gray-500 text-xs">{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Biến động',
      dataIndex: 'change_amount',
      key: 'change_amount',
      render: (amount: number) => {
        const isPositive = amount > 0;
        return (
          <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{amount}
          </span>
        );
      },
    },
    {
      title: 'Số dư sau GD',
      dataIndex: 'balance_after',
      key: 'balance_after',
      render: (balance: number) => <span className="font-medium text-blue-600">{balance}</span>,
    },
    {
      title: 'Lý do (Nguồn)',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => dayjs(time).format('HH:mm:ss DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: PointHistory) => (
        <Button 
          type="primary" 
          ghost 
          icon={<EditOutlined />} 
          size="small"
          onClick={() => {
            if(record.user) onAdjustClick(record.user);
          }}
        >
          Cộng/Trừ điểm
        </Button>
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
      pagination={{
        current: currentPage,
        pageSize: 15,
        total: totalItems,
        showSizeChanger: false,
      }}
      onChange={onTableChange}
    />
  );
};

export default PointHistoryTable;