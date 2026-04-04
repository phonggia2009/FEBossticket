import React from 'react';
import { Row, Col, Select, DatePicker, Button, Space, Segmented } from 'antd';
import {
  FilterOutlined,
  ClearOutlined,
  TableOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ShowtimeFilters, ViewMode, Movie, Cinema } from '../type';
import { DATE_FORMAT, API_DATE_FORMAT } from '../constants';

interface Props {
  filters:   ShowtimeFilters;
  movies:    Movie[];
  cinemas:   Cinema[];
  viewMode:  ViewMode;
  onFilterChange:  (partial: Partial<ShowtimeFilters>) => void;
  onClearFilters:  () => void;
  onViewModeChange:(mode: ViewMode) => void;
}

const ShowtimeFiltersBar: React.FC<Props> = ({
  filters,
  movies,
  cinemas,
  viewMode,
  onFilterChange,
  onClearFilters,
  onViewModeChange,
}) => {
  const hasActiveFilters = !!(filters.movieId || filters.cinemaId || filters.date);

  return (
    <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 20 }}>
      {/* Phim */}
      <Col xs={24} sm={12} md={6}>
        <Select
          allowClear
          showSearch
          placeholder="🎬 Tất cả phim"
          style={{ width: '100%' }}
          value={filters.movieId}
          onChange={val => onFilterChange({ movieId: val })}
          filterOption={(input, opt) =>
            String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={movies.map(m => ({
            value: m.id,
            label: `${m.title} (${m.duration} phút)`,
          }))}
        />
      </Col>

      {/* Rạp */}
      <Col xs={24} sm={12} md={6}>
        <Select
          allowClear
          showSearch
          placeholder="🏟️ Tất cả rạp"
          style={{ width: '100%' }}
          value={filters.cinemaId}
          onChange={val => onFilterChange({ cinemaId: val })}
          filterOption={(input, opt) =>
            String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={cinemas.map(c => ({
            value: c.id,
            label: c.cinema_name,
          }))}
        />
      </Col>

      {/* Ngày */}
      <Col xs={24} sm={12} md={5}>
        <DatePicker
          style={{ width: '100%' }}
          placeholder="📅 Chọn ngày"
          format={DATE_FORMAT}
          value={filters.date ? dayjs(filters.date) : null}
          onChange={date =>
            onFilterChange({ date: date ? date.format(API_DATE_FORMAT) : undefined })
          }
        />
      </Col>

      {/* Xóa bộ lọc */}
      {hasActiveFilters && (
        <Col xs={24} sm={12} md={3}>
          <Button
            icon={<ClearOutlined />}
            onClick={onClearFilters}
            danger
            style={{ width: '100%' }}
          >
            Xóa bộ lọc
          </Button>
        </Col>
      )}

      {/* View mode toggle */}
      <Col xs={24} md={{ span: hasActiveFilters ? 4 : 7, offset: 0 }}
        style={{ marginLeft: 'auto' }}
      >
        <Segmented
          value={viewMode}
          onChange={v => onViewModeChange(v as ViewMode)}
          options={[
            { value: 'table',    label: 'Bảng',    icon: <TableOutlined />    },
            { value: 'calendar', label: 'Lịch',    icon: <CalendarOutlined /> },
          ]}
        />
      </Col>
    </Row>
  );
};

export default ShowtimeFiltersBar;