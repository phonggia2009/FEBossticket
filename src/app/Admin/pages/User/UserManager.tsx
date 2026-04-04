// src/app/Admin/pages/Users/UserManager.tsx

import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useUserManager } from './useUserManager';
import UserFiltersBar from './components/UserFilters';
import UserTable      from './components/UserTable';
import UserModal      from './components/UserModal';

const { Title, Text } = Typography;

const UserManager: React.FC = () => {
  const {
    users, pagination, loading,
    filters, roleModalOpen, roleTarget, submitting,
    handleFilterChange, handleClearFilters, handlePageChange,
    handleOpenRoleModal, handleCloseRoleModal,
    handleUpdateRole, handleDeleteConfirm,
  } = useUserManager();

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Space align="center" style={{ marginBottom: 24 }}>
        <TeamOutlined style={{ fontSize: 28, color: '#1677ff' }} />
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý người dùng</Title>
          <Text type="secondary">
            Tổng cộng{' '}
            <Tag color="blue" style={{ marginInline: 4 }}>
              {pagination.totalItems}
            </Tag>
            người dùng
          </Text>
        </div>
      </Space>

      <Card>
        {/* Filters */}
        <UserFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <UserTable
          users={users}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          onEditRole={handleOpenRoleModal}
          onDelete={handleDeleteConfirm}
        />
      </Card>

      {/* Modal đổi role */}
      <UserModal
        open={roleModalOpen}
        target={roleTarget}
        submitting={submitting}
        onConfirm={handleUpdateRole}
        onCancel={handleCloseRoleModal}
      />
    </div>
  );
};

export default UserManager;