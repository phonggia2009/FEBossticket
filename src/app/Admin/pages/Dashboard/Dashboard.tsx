import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Progress,
  Spin,
  message,
  Badge,
  Tag,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Space,
} from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
  FireOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined, 
  StarFilled
} from '@ant-design/icons';
import { getDashboardStats } from '../../../../common/api/adminAPI';

const { Title, Text } = Typography;

interface DashboardData {
  totalRevenue: number;
  totalBookings: number;
  statusBreakdown: { PENDING: number; SUCCESS: number; CANCELLED: number };
  cancelRate: number;
  occupancyRate: number;
  topMovies: Array<{
    id: number;
    title: string;
    posterUrl: string;
    ticket_count: number;
    revenue: number;
  }>;
  topRatedMovies: Array<{
    id: number;
    title: string;
    posterUrl: string;
    averageRating: number;
    reviewCount: number;
  }>;
}

const rankColors = ['#faad14', '#8c8c8c', '#cd7f32', '#1677ff', '#52c41a'];
const rankLabels = ['1', '2', '3', '4', '5'];

const StatCard: React.FC<{
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accentColor: string;
  footer?: React.ReactNode;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
}> = ({ title, value, icon, accentColor, footer, trend, trendValue }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      borderTop: `4px solid ${accentColor}`,
      height: '100%',
    }}
    bodyStyle={{ padding: '20px 24px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
          {title}
        </Text>
        <div style={{ marginTop: 8, fontSize: 26, fontWeight: 700, color: accentColor, lineHeight: 1.2 }}>
          {value}
        </div>
        {trend && trendValue && (
          <Space style={{ marginTop: 6 }}>
            {trend === 'up' ? (
              <RiseOutlined style={{ color: '#52c41a' }} />
            ) : (
              <FallOutlined style={{ color: '#ff4d4f' }} />
            )}
            <Text style={{ fontSize: 12, color: trend === 'up' ? '#52c41a' : '#ff4d4f' }}>
              {trendValue}
            </Text>
          </Space>
        )}
      </div>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `${accentColor}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: accentColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
    {footer && (
      <>
        <Divider style={{ margin: '14px 0 10px' }} />
        <div style={{ fontSize: 12 }}>{footer}</div>
      </>
    )}
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setData(res.data.data);
      } catch (error) {
        message.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!data) return null;

  const successRate = data.totalBookings
    ? Math.round((data.statusBreakdown.SUCCESS / data.totalBookings) * 100)
    : 0;

  const topMoviesColumns = [
    {
      title: 'Hạng',
      key: 'rank',
      width: 72,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: index < 3 ? `${rankColors[index]}22` : '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: index < 3 ? 20 : 14,
            fontWeight: 700,
            color: rankColors[index],
          }}
        >
          {rankLabels[index]}
        </div>
      ),
    },
    {
      title: 'Phim',
      key: 'movie',
      render: (_: any, record: any) => (
        <Space>
          <Avatar
            src={record.posterUrl}
            shape="square"
            size={48}
            style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <Text strong style={{ fontSize: 14, color: '#1677ff' }}>
              {record.title}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: #{record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Vé bán ra',
      dataIndex: 'ticket_count',
      key: 'ticket_count',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.ticket_count - b.ticket_count,
      render: (count: number) => (
        <Tag color="blue" style={{ fontSize: 13, padding: '2px 10px', borderRadius: 20 }}>
          🎟 {count.toLocaleString('vi-VN')} vé
        </Tag>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      defaultSortOrder: 'descend' as const,
      render: (rev: number) => (
        <Text strong style={{ color: '#cf1322', fontSize: 14 }}>
          {rev.toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
    {
      title: 'Tỷ trọng',
      key: 'share',
      width: 160,
      render: (_: any, record: any) => {
        const maxRevenue = Math.max(...data.topMovies.map((m) => m.revenue));
        const pct = Math.round((record.revenue / maxRevenue) * 100);
        return (
          <Tooltip title={`${pct}% so với phim dẫn đầu`}>
            <Progress
              percent={pct}
              size="small"
              strokeColor={pct === 100 ? '#faad14' : '#1677ff'}
              format={(p) => <span style={{ fontSize: 11 }}>{p}%</span>}
            />
          </Tooltip>
        );
      },
    },
  ];
  const topRatedColumns = [
    {
      title: 'Hạng',
      key: 'rank',
      width: 72,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: index < 3 ? `${rankColors[index]}22` : '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontSize: index < 3 ? 20 : 14,
            fontWeight: 700,
            color: rankColors[index],
          }}
        >
          {rankLabels[index]}
        </div>
      ),
    },
    {
      title: 'Phim',
      key: 'movie',
      render: (_: any, record: any) => (
        <Space>
          <Avatar
            src={record.posterUrl}
            shape="square"
            size={48}
            style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <Text strong style={{ fontSize: 14, color: '#1677ff' }}>
              {record.title}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: #{record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'averageRating',
      key: 'averageRating',
      align: 'center' as const,
      render: (rating: string) => (
        <Space>
          <Text strong style={{ fontSize: 16, color: '#faad14' }}>{rating}</Text>
          <StarFilled style={{ color: '#faad14' }} />
        </Space>
      ),
    },
    {
      title: 'Số lượt',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      align: 'right' as const,
      render: (count: number) => (
        <Text type="secondary">{count.toLocaleString('vi-VN')} lượt đánh giá</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
          📊 Báo Cáo Tổng Quan
        </Title>
        <Text type="secondary">Thống kê hoạt động kinh doanh toàn hệ thống</Text>
      </div>

      {/* Row 1: Stat Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tổng Doanh Thu"
            value={`${data.totalRevenue.toLocaleString('vi-VN')} ₫`}
            icon={<DollarOutlined />}
            accentColor="#1677ff"
            trend="up"
            trendValue="So với kỳ trước"
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tổng Số Vé"
            value={data.totalBookings.toLocaleString('vi-VN')}
            icon={<ShoppingCartOutlined />}
            accentColor="#52c41a"
            footer={
              <Space wrap size={6}>
                <Badge color="#52c41a" text={<Text style={{ fontSize: 12, color: '#52c41a' }}>Thành công: {data.statusBreakdown.SUCCESS}</Text>} />
                <Badge color="#faad14" text={<Text style={{ fontSize: 12, color: '#faad14' }}>Chờ TT: {data.statusBreakdown.PENDING}</Text>} />
                <Badge color="#ff4d4f" text={<Text style={{ fontSize: 12, color: '#ff4d4f' }}>Đã hủy: {data.statusBreakdown.CANCELLED}</Text>} />
              </Space>
            }
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tỷ Lệ Hủy Vé"
            value={`${data.cancelRate}%`}
            icon={<CloseCircleOutlined />}
            accentColor="#ff4d4f"
            footer={
              <div>
                <Progress
                  percent={data.cancelRate}
                  size="small"
                  strokeColor="#ff4d4f"
                  trailColor="#fff1f0"
                  showInfo={false}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {data.statusBreakdown.CANCELLED} / {data.totalBookings} đơn bị hủy
                </Text>
              </div>
            }
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tỷ Lệ Lấp Đầy Ghế"
            value={`${data.occupancyRate}%`}
            icon={<PieChartOutlined />}
            accentColor="#722ed1"
            footer={
              <div>
                <Progress
                  percent={data.occupancyRate}
                  size="small"
                  strokeColor={{ from: '#9254de', to: '#722ed1' }}
                  trailColor="#f9f0ff"
                  showInfo={false}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {data.occupancyRate >= 80 ? '🔥 Rất tốt' : data.occupancyRate >= 50 ? '👍 Khá tốt' : '⚠️ Cần cải thiện'}
                </Text>
              </div>
            }
          />
        </Col>
      </Row>

      {/* Row 2: Breakdown + Top Movies */}
      <Row gutter={[20, 20]}>
        {/* Trạng thái đơn hàng */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%' }}
            title={
              <Space>
                <PieChartOutlined style={{ color: '#1677ff' }} />
                <span style={{ fontWeight: 700 }}>Tình Trạng Vé</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size={20}>
              {/* Thành công */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text>Thành công</Text>
                  </Space>
                  <Text strong style={{ color: '#52c41a' }}>
                    {data.statusBreakdown.SUCCESS}
                  </Text>
                </div>
                <Progress
                  percent={Math.round((data.statusBreakdown.SUCCESS / data.totalBookings) * 100)}
                  strokeColor="#52c41a"
                  trailColor="#f6ffed"
                  size="small"
                />
              </div>
              {/* Chờ thanh toán */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#faad14' }} />
                    <Text>Chờ thanh toán</Text>
                  </Space>
                  <Text strong style={{ color: '#faad14' }}>
                    {data.statusBreakdown.PENDING}
                  </Text>
                </div>
                <Progress
                  percent={Math.round((data.statusBreakdown.PENDING / data.totalBookings) * 100)}
                  strokeColor="#faad14"
                  trailColor="#fffbe6"
                  size="small"
                />
              </div>

              {/* Đã hủy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Space>
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    <Text>Đã hủy</Text>
                  </Space>
                  <Text strong style={{ color: '#ff4d4f' }}>
                    {data.statusBreakdown.CANCELLED}
                  </Text>
                </div>
                <Progress
                  percent={Math.round((data.statusBreakdown.CANCELLED / data.totalBookings) * 100)}
                  strokeColor="#ff4d4f"
                  trailColor="#fff1f0"
                  size="small"
                />
              </div>

              <Divider style={{ margin: '4px 0' }} />

              {/* Tỷ lệ thành công tổng hợp */}
              <div style={{ textAlign: 'center' }}>
                <Statistic
                  title="Tỷ lệ thành công"
                  value={successRate}
                  suffix="%"
                  valueStyle={{ color: '#52c41a', fontWeight: 800, fontSize: 32 }}
                />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            {/* CARD 1: TOP BÁN CHẠY (GIỮ NGUYÊN) */}
            <Card
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
              title={
                <Space>
                  <FireOutlined style={{ color: '#ff4d4f' }} />
                  <span style={{ fontWeight: 700 }}>Top 5 Phim Bán Chạy Nhất</span>
                  <Tag color="red" style={{ borderRadius: 20 }}>
                    <TrophyOutlined /> HOT
                  </Tag>
                </Space>
              }
            >
              <Table
                dataSource={data.topMovies}
                columns={topMoviesColumns}
                rowKey="id"
                pagination={false}
                size="middle"
                rowClassName={(_, index) => index === 0 ? 'top-movie-row-gold' : ''}
                style={{ borderRadius: 8, overflow: 'hidden' }}
              />
            </Card>

            {/* CARD 2: TOP ĐÁNH GIÁ (MỚI) */}
            <Card
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
              title={
                <Space>
                  <StarOutlined style={{ color: '#faad14', fontSize: 18 }} />
                  <span style={{ fontWeight: 700 }}>Top 5 Phim Đánh Giá Cao Nhất</span>
                  <Tag color="gold" style={{ borderRadius: 20 }}>
                    <StarFilled /> NỔI BẬT
                  </Tag>
                </Space>
              }
            >
              <Table
                dataSource={data.topRatedMovies}
                columns={topRatedColumns}
                rowKey="id"
                pagination={false}
                size="middle"
                rowClassName={(_, index) => index === 0 ? 'top-movie-row-gold' : ''}
                style={{ borderRadius: 8, overflow: 'hidden' }}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;