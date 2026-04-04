// src/app/Admin/pages/Users/components/UserFilters.tsx

import React from 'react';
import { Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { UserFilters, UserRole } from '../type';

interface Props {
  filters:           UserFilters;
  onFilterChange:    (partial: Partial<UserFilters>) => void;
  onClearFilters:    () => void;
}

const ROLE_OPTIONS = [
  { value: '',      label: 'Tất cả quyền' },
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'USER',  label: 'Người dùng' },
];

const UserFiltersBar: React.FC<Props> = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 16 }}>
      <Col flex="1" style={{ minWidth: 220 }}>
        <Input
          allowClear
          placeholder="Tìm theo tên, email, số điện thoại..."
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          value={filters.search ?? ''}
          onChange={e => onFilterChange({ search: e.target.value })}
        />
      </Col>
      <Col>
        <Select
          style={{ width: 180 }}
          value={filters.role ?? ''}
          options={ROLE_OPTIONS}
          onChange={val => onFilterChange({ role: val as UserRole | '' })}
        />
      </Col>
      <Col>
        <Button icon={<ClearOutlined />} onClick={onClearFilters}>
          Xóa bộ lọc
        </Button>
      </Col>
    </Row>
  );
};

export default UserFiltersBar;