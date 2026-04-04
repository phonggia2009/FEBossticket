// src/app/Admin/pages/Products/components/ProductTable.tsx

import React from 'react';
import {
  Table, Tag, Avatar, Typography, Space,
  Button, Popconfirm, Tooltip, Switch, Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, StockOutlined } from '@ant-design/icons';
import type { Product, Pagination } from '../type';
import { PRODUCT_TYPE_LABELS, PRODUCT_TYPE_COLORS, PRODUCT_TYPE_ICONS } from '../constants';

const { Text } = Typography;

interface Props {
  products:        Product[];
  pagination:      Pagination;
  loading:         boolean;
  onPageChange:    (page: number) => void;
  onEdit:          (p: Product) => void;
  onDelete:        (p: Product) => void;
  onToggle:        (p: Product) => void;
  onUpdateStock:   (p: Product) => void;
}

const ProductTable: React.FC<Props> = ({
  products, pagination, loading,
  onPageChange, onEdit, onDelete, onToggle, onUpdateStock,
}) => {
  const columns: ColumnsType<Product> = [
    {
      title: 'Sản phẩm',
      key:   'product',
      render: (_, r) => (
        <Space>
          <Avatar
            size={44}
            src={r.imageUrl}
            style={{ background: '#f0f0f0', fontSize: 22, flexShrink: 0 }}
          >
            {!r.imageUrl && PRODUCT_TYPE_ICONS[r.type]}
          </Avatar>
          <div>
            <div><Text strong>{r.product_name}</Text></div>
            {r.description && (
              <Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ tooltip: r.description }}>
                {r.description}
              </Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title:  'Loại',
      key:    'type',
      width:  120,
      render: (_, r) => (
        <Tag color={PRODUCT_TYPE_COLORS[r.type]}>
          {PRODUCT_TYPE_ICONS[r.type]} {PRODUCT_TYPE_LABELS[r.type]}
        </Tag>
      ),
    },
    {
      title:     'Giá',
      dataIndex: 'price',
      key:       'price',
      width:     130,
      render:    val =>
        <Text strong style={{ color: '#1677ff' }}>
          {Number(val).toLocaleString('vi-VN')}₫
        </Text>,
    },
    {
      title:  'Tồn kho',
      key:    'quantity',
      width:  110,
      render: (_, r) => (
        <Badge
          count={r.quantity}
          showZero
          color={r.quantity > 10 ? '#52c41a' : r.quantity > 0 ? '#faad14' : '#ff4d4f'}
          overflowCount={999}
        />
      ),
    },
    {
      title:  'Trạng thái',
      key:    'isAvailable',
      width:  130,
      render: (_, r) => (
        <Tooltip title={r.isAvailable ? 'Click để ẩn' : 'Click để hiện'}>
          <Switch
            checked={r.isAvailable}
            checkedChildren="Đang bán"
            unCheckedChildren="Đã ẩn"
            onChange={() => onToggle(r)}
            size="small"
          />
        </Tooltip>
      ),
    },
    {
      title:  'Thao tác',
      key:    'actions',
      width:  130,
      align:  'center',
      render: (_, r) => (
        <Space>
          <Tooltip title="Cập nhật tồn kho">
            <Button type="text" icon={<StockOutlined />} onClick={() => onUpdateStock(r)} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(r)} />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Bạn có chắc muốn xóa "${r.product_name}"?`}
            onConfirm={() => onDelete(r)}
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
    <Table<Product>
      rowKey="id"
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={{
        current:   pagination.currentPage,
        pageSize:  DEFAULT_PAGE_SIZE,
        total:     pagination.totalItems,
        onChange:  onPageChange,
        showTotal: total => `Tổng ${total} sản phẩm`,
        showSizeChanger: false,
      }}
      scroll={{ x: 900 }}
    />
  );
};

// eslint-disable-next-line
const DEFAULT_PAGE_SIZE = 15;

export default ProductTable;