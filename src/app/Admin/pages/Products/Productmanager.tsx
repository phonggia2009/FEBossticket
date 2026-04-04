// src/app/Admin/pages/Products/ProductManager.tsx

import React from 'react';
import { Card, Typography, Space, Button, Tag } from 'antd';
import { PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useProductManager } from './Useproductmanager';
import ProductFiltersBar from './components/Productfilters';
import ProductTable      from './components/Producttable';
import ProductModal      from './components/Productmodal';
import StockModal        from './components/Stockmodal';

const { Title, Text } = Typography;

const ProductManager: React.FC = () => {
  const {
    products, pagination, loading,
    filters, modalOpen, editTarget, submitting,
    stockModalOpen, stockTarget,
    handleFilterChange, handleClearFilters, handlePageChange,
    handleOpenCreate, handleOpenEdit, handleCloseModal,
    handleSubmit, handleDeleteConfirm, handleToggleAvailability,
    handleOpenStockModal, handleCloseStockModal, handleUpdateStock,
  } = useProductManager();

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Space align="center" style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
        <Space align="center">
          <ShoppingOutlined style={{ fontSize: 28, color: '#1677ff' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>Quản lý sản phẩm</Title>
            <Text type="secondary">
              Tổng cộng{' '}
              <Tag color="blue" style={{ marginInline: 4 }}>{pagination.totalItems}</Tag>
              sản phẩm
            </Text>
          </div>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Card>
        <ProductFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        <ProductTable
          products={products}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteConfirm}
          onToggle={handleToggleAvailability}
          onUpdateStock={handleOpenStockModal}
        />
      </Card>

      {/* Modal thêm/sửa */}
      <ProductModal
        open={modalOpen}
        editTarget={editTarget}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />

      {/* Modal tồn kho */}
      <StockModal
        open={stockModalOpen}
        target={stockTarget}
        submitting={submitting}
        onConfirm={handleUpdateStock}
        onCancel={handleCloseStockModal}
      />
    </div>
  );
};

export default ProductManager;