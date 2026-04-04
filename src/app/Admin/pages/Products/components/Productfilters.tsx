// src/app/Admin/pages/Products/components/ProductFilters.tsx

import React from 'react';
import { Input, Select, Button, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { ProductFilters, ProductType } from '../type';
import { PRODUCT_TYPE_ICONS } from '../constants';

interface Props {
  filters:        ProductFilters;
  onFilterChange: (partial: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
}

const TYPE_OPTIONS = [
  { value: '',      label: 'Tất cả loại' },
  { value: 'FOOD',  label: `${PRODUCT_TYPE_ICONS.FOOD}  Đồ ăn` },
  { value: 'DRINK', label: `${PRODUCT_TYPE_ICONS.DRINK}  Đồ uống` },
  { value: 'COMBO', label: `${PRODUCT_TYPE_ICONS.COMBO}  Combo` },
];

const AVAILABLE_OPTIONS = [
  { value: '',      label: 'Tất cả trạng thái' },
  { value: 'true',  label: '✅ Đang bán' },
  { value: 'false', label: '🚫 Đã ẩn' },
];

const ProductFiltersBar: React.FC<Props> = ({ filters, onFilterChange, onClearFilters }) => (
  <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 16 }}>
    <Col flex="1" style={{ minWidth: 220 }}>
      <Input
        allowClear
        placeholder="Tìm theo tên sản phẩm..."
        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
        value={filters.search ?? ''}
        onChange={e => onFilterChange({ search: e.target.value })}
      />
    </Col>
    <Col>
      <Select
        style={{ width: 160 }}
        value={filters.type ?? ''}
        options={TYPE_OPTIONS}
        onChange={val => onFilterChange({ type: val as ProductType | '' })}
      />
    </Col>
    <Col>
      <Select
        style={{ width: 180 }}
        value={filters.isAvailable ?? ''}
        options={AVAILABLE_OPTIONS}
        onChange={val => onFilterChange({ isAvailable: val })}
      />
    </Col>
    <Col>
      <Button icon={<ClearOutlined />} onClick={onClearFilters}>
        Xóa bộ lọc
      </Button>
    </Col>
  </Row>
);

export default ProductFiltersBar;