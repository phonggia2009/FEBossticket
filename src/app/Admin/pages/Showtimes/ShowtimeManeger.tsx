import React from 'react';
import { Card, Button, Typography, Space, Statistic, Row, Col } from 'antd';
import { PlusOutlined, CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useShowtimeManager } from './useShowtimeManager';
import ShowtimeFiltersBar from './components/Showtimefilters';
import ShowtimeTable      from './components/Showtimetable';
import ShowtimeCalendar   from './components/Showtimecalendar';
import ShowtimeModal      from './components/Showtimemodal';

const { Title, Text } = Typography;

const ShowtimeManager: React.FC = () => {
  const {
    // data
    showtimes, movies, cinemas, pagination,
    // ui
    loading, viewMode,
    // modal
    modalOpen, editTarget, submitting,
    // filters
    filters,
    // actions
    handleFilterChange, handleClearFilters,
    handlePageChange,
    handleOpenCreate, handleOpenEdit,
    handleCloseModal, handleSubmit,
    handleDeleteConfirm, handleViewModeChange,
  } = useShowtimeManager();

  const upcomingCount = showtimes.filter(s =>
    s.movie?.duration &&
    new Date(s.start_time).getTime() > Date.now()
  ).length;

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'flex-start',
          marginBottom:    24,
          flexWrap:        'wrap',
          gap:             12,
        }}
      >
        <Space direction="vertical" size={2}>
          <Title level={3} style={{ margin: 0 }}>
            <CalendarOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Quản lý lịch chiếu
          </Title>
          <Text type="secondary">
            Tổng {pagination.totalItems} suất chiếu
          </Text>
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreate}
        >
          Thêm lịch chiếu
        </Button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={8} md={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title="Tổng suất chiếu"
              value={pagination.totalItems}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small" style={{ borderRadius: 10 }}>
            <Statistic
              title="Sắp chiếu (trang này)"
              value={upcomingCount}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── Main card ───────────────────────────────────────────────────── */}
      <Card
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        {/* Filters */}
        <ShowtimeFiltersBar
          filters={filters}
          movies={movies}
          cinemas={cinemas}
          viewMode={viewMode}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onViewModeChange={handleViewModeChange}
        />

        {/* Content */}
        {viewMode === 'table' ? (
          <ShowtimeTable
            showtimes={showtimes}
            pagination={pagination}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteConfirm}
            onPageChange={handlePageChange}
          />
        ) : (
          <ShowtimeCalendar
            showtimes={showtimes}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteConfirm}
          />
        )}
      </Card>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      <ShowtimeModal
        open={modalOpen}
        editTarget={editTarget}
        movies={movies}
        cinemas={cinemas}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default ShowtimeManager;