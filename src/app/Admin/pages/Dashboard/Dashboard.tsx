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
  CheckSquareOutlined,
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
  TeamOutlined,
  UserAddOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { getDashboardStats } from '../../../../common/api/adminAPI';

const { Title, Text } = Typography;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface MonthlyRevenue {
  month: string;
  revenue: number;
  revenueSuccess: number;
  revenueNoShow: number;
  revenueUsed: number;
  bookingCount: number;
}

interface DashboardData {
  // Doanh thu
  totalRevenue: number;
  revenueSuccess: number;
  revenueNoShow: number;
  revenueUsed: number;
  revenueThisMonth: number;
  revenueSuccessThisMonth: number;
  revenueNoShowThisMonth: number;
  revenueUsedThisMonth: number;
  revenueLastMonth: number;
  revenueSuccessLastMonth: number;
  revenueNoShowLastMonth: number;
  revenueUsedLastMonth: number;
  revenueTrend: number | null;
  monthlyRevenue: MonthlyRevenue[];

  // Booking
  totalBookings: number;
  statusBreakdown: { PENDING: number; SUCCESS: number; CANCELLED: number; NO_SHOW: number; USED: number };
  cancelRate: number;

  // Ghế
  occupancyRate: number;

  // Phim
  topMovies: Array<{ id: number; title: string; posterUrl: string; ticket_count: number; revenue: number }>;
  topRatedMovies: Array<{ id: number; title: string; posterUrl: string; averageRating: number; reviewCount: number }>;

  // Người dùng
  totalUsers: number;
  newUsersThisMonth: number;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const rankColors = ['#faad14', '#8c8c8c', '#cd7f32', '#1677ff', '#52c41a'];
const rankLabels = ['1', '2', '3', '4', '5'];

const formatVND = (v: number) => v.toLocaleString('vi-VN') + ' ₫';

const shortMonth = (isoString: string) => {
  const d = new Date(isoString);
  return `T${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
};

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accentColor: string;
  footer?: React.ReactNode;
  trend?: number | null;       // % dương/âm; null = ẩn
  trendLabel?: string;
}> = ({ title, value, icon, accentColor, footer, trend, trendLabel }) => {
  const hasTrend = trend !== null && trend !== undefined;
  const isUp = hasTrend && trend! >= 0;

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderTop: `4px solid ${accentColor}`, height: '100%' }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{title}</Text>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: accentColor, lineHeight: 1.2, wordBreak: 'break-all' }}>
            {value}
          </div>
          {hasTrend && (
            <Space style={{ marginTop: 6 }}>
              {isUp
                ? <RiseOutlined style={{ color: '#52c41a' }} />
                : <FallOutlined style={{ color: '#ff4d4f' }} />}
              <Text style={{ fontSize: 12, color: isUp ? '#52c41a' : '#ff4d4f' }}>
                {isUp ? '+' : ''}{trend}% {trendLabel || 'so với tháng trước'}
              </Text>
            </Space>
          )}
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${accentColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: accentColor, flexShrink: 0, marginLeft: 12,
        }}>
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
};

// ─────────────────────────────────────────────────────────────
// MONTHLY REVENUE BAR CHART  (pure CSS)
// ─────────────────────────────────────────────────────────────
const RevenueBarChart: React.FC<{ data: MonthlyRevenue[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '24px 0' }}>Chưa có dữ liệu</Text>;
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, padding: '0 4px' }}>
      {data.map((item, idx) => {
        const pct = Math.round((item.revenue / maxRevenue) * 100);
        const isLast = idx === data.length - 1;
        return (
          <Tooltip
            key={item.month}
            title={
              <div>
                <div style={{ fontWeight: 600 }}>{shortMonth(item.month)}</div>
                <div>Tổng: {formatVND(item.revenue)}</div>
                <div style={{ color: '#52c41a' }}>✓ Success: {formatVND(item.revenueSuccess)}</div>
                <div style={{ color: '#722ed1' }}>🎟 Used: {formatVND(item.revenueUsed)}</div>
                <div style={{ color: '#8c8c8c' }}>✗ No-show: {formatVND(item.revenueNoShow)}</div>
                <div>Số đơn: {item.bookingCount}</div>
              </div>
            }
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'default' }}>
              {/* Revenue label on top */}
              <Text style={{ fontSize: 10, color: isLast ? '#1677ff' : '#8c8c8c', fontWeight: isLast ? 700 : 400, whiteSpace: 'nowrap' }}>
                {item.revenue >= 1_000_000
                  ? `${(item.revenue / 1_000_000).toFixed(1)}tr`
                  : `${(item.revenue / 1_000).toFixed(0)}k`}
              </Text>
              {/* Bar */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: 120 }}>
                <div style={{
                  width: '100%',
                  height: `${Math.max(pct, 4)}%`,
                  background: isLast
                    ? 'linear-gradient(180deg, #4096ff 0%, #1677ff 100%)'
                    : 'linear-gradient(180deg, #bae0ff 0%, #93c4fd 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.3s',
                  boxShadow: isLast ? '0 2px 8px rgba(22,119,255,0.3)' : 'none',
                }} />
              </div>
              {/* Month label */}
              <Text style={{ fontSize: 11, color: isLast ? '#1677ff' : '#595959', fontWeight: isLast ? 700 : 400 }}>
                {shortMonth(item.month)}
              </Text>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// STATUS ROW HELPER
// ─────────────────────────────────────────────────────────────
const StatusRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
  color: string;
  trailColor: string;
}> = ({ icon, label, count, total, color, trailColor }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <Space>{icon}<Text>{label}</Text></Space>
      <Space>
        <Text strong style={{ color }}>{count.toLocaleString('vi-VN')}</Text>
        <Text type="secondary" style={{ fontSize: 11 }}>
          ({total > 0 ? Math.round((count / total) * 100) : 0}%)
        </Text>
      </Space>
    </div>
    <Progress percent={total > 0 ? Math.round((count / total) * 100) : 0} strokeColor={color} trailColor={trailColor} size="small" showInfo={false} />
  </div>
);

// ─────────────────────────────────────────────────────────────
// TABLE COLUMN HELPERS
// ─────────────────────────────────────────────────────────────
const RankCell: React.FC<{ index: number }> = ({ index }) => (
  <div style={{
    width: 34, height: 34, borderRadius: '50%',
    background: index < 3 ? `${rankColors[index]}22` : '#f5f5f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
    fontSize: index < 3 ? 18 : 13, fontWeight: 700, color: rankColors[index],
  }}>
    {index < 3 ? ['🥇', '🥈', '🥉'][index] : rankLabels[index]}
  </div>
);

const MovieCell: React.FC<{ record: { id: number; title: string; posterUrl: string } }> = ({ record }) => (
  <Space>
    <Avatar src={record.posterUrl} shape="square" size={44}
      style={{ borderRadius: 8, flexShrink: 0, objectFit: 'cover' }} />
    <div>
      <Text strong style={{ fontSize: 13, color: '#1677ff', display: 'block' }}>{record.title}</Text>
      <Text type="secondary" style={{ fontSize: 11 }}>ID #{record.id}</Text>
    </div>
  </Space>
);

// ─────────────────────────────────────────────────────────────
// DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboardStats();
        setData(res.data.data);
      } catch {
        message.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!data) return null;

  const { statusBreakdown, totalBookings } = data;
  
  // Tỷ lệ thành công gộp cả SUCCESS và USED
  const successCount = (statusBreakdown.SUCCESS || 0) + (statusBreakdown.USED || 0);
  const successRate = totalBookings > 0 ? Math.round((successCount / totalBookings) * 100) : 0;

  // ── Table columns: top movies ──────────────────────────────
  const topMoviesColumns = [
    {
      title: 'Hạng', key: 'rank', width: 60, align: 'center' as const,
      render: (_: any, __: any, i: number) => <RankCell index={i} />,
    },
    {
      title: 'Phim', key: 'movie',
      render: (_: any, record: any) => <MovieCell record={record} />,
    },
    {
      title: 'Vé bán', dataIndex: 'ticket_count', key: 'ticket_count', align: 'center' as const,
      sorter: (a: any, b: any) => a.ticket_count - b.ticket_count,
      render: (v: number) => (
        <Tag color="blue" style={{ borderRadius: 20, fontSize: 12, padding: '1px 10px' }}>
          🎟 {v.toLocaleString('vi-VN')}
        </Tag>
      ),
    },
    {
      title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', align: 'right' as const,
      defaultSortOrder: 'descend' as const,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (v: number) => (
        <Text strong style={{ color: '#cf1322', fontSize: 13 }}>{formatVND(v)}</Text>
      ),
    },
    {
      title: 'Tỷ trọng', key: 'share', width: 140,
      render: (_: any, record: any) => {
        const max = Math.max(...data.topMovies.map(m => m.revenue));
        const pct = Math.round((record.revenue / max) * 100);
        return (
          <Tooltip title={`${pct}% so với phim dẫn đầu`}>
            <Progress percent={pct} size="small"
              strokeColor={pct === 100 ? '#faad14' : '#1677ff'}
              format={p => <span style={{ fontSize: 11 }}>{p}%</span>} />
          </Tooltip>
        );
      },
    },
  ];

  // ── Table columns: top rated ────────────────────────────────
  const topRatedColumns = [
    {
      title: 'Hạng', key: 'rank', width: 60, align: 'center' as const,
      render: (_: any, __: any, i: number) => <RankCell index={i} />,
    },
    {
      title: 'Phim', key: 'movie',
      render: (_: any, record: any) => <MovieCell record={record} />,
    },
    {
      title: 'Điểm TB', dataIndex: 'averageRating', key: 'averageRating', align: 'center' as const,
      sorter: (a: any, b: any) => a.averageRating - b.averageRating,
      render: (rating: number) => (
        <Space>
          <Text strong style={{ fontSize: 15, color: '#faad14' }}>{rating}</Text>
          <StarFilled style={{ color: '#faad14' }} />
        </Space>
      ),
    },
    {
      title: 'Lượt đánh giá', dataIndex: 'reviewCount', key: 'reviewCount', align: 'right' as const,
      render: (v: number) => (
        <Text type="secondary">{v.toLocaleString('vi-VN')} lượt</Text>
      ),
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>📊 Báo Cáo Tổng Quan</Title>
        <Text type="secondary">Thống kê hoạt động kinh doanh toàn hệ thống</Text>
      </div>

      {/* ── ROW 1: Stat Cards ─────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>

        {/* Tổng doanh thu */}
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tổng Doanh Thu"
            value={formatVND(data.totalRevenue)}
            icon={<DollarOutlined />}
            accentColor="#1677ff"
            trend={data.revenueTrend}
            footer={
              <Space direction="vertical" style={{ width: '100%' }} size={4}>
                {/* --- PHẦN 1: TỔNG DOANH THU TOÀN HỆ THỐNG --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>✓ Thành công</Text>
                  <Text strong style={{ color: '#52c41a', fontSize: 11 }}>{formatVND(data.revenueSuccess)}</Text>
                </div>
                {/* DÒNG BỔ SUNG: Doanh thu Đã sử dụng toàn hệ thống */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>🎟 Đã sử dụng (Used)</Text>
                  <Text strong style={{ color: '#722ed1', fontSize: 11 }}>{formatVND(data.revenueUsed)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>✗ No-show</Text>
                  <Text strong style={{ color: '#8c8c8c', fontSize: 11 }}>{formatVND(data.revenueNoShow)}</Text>
                </div>
                
                <Divider style={{ margin: '2px 0' }} />
                
                {/* --- PHẦN 2: DOANH THU THÁNG NÀY --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Tháng này</Text>
                  <Text strong style={{ color: '#1677ff', fontSize: 11 }}>{formatVND(data.revenueThisMonth)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>↳ Success</Text>
                  <Text style={{ color: '#52c41a', fontSize: 11 }}>{formatVND(data.revenueSuccessThisMonth)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>↳ Used</Text>
                  <Text style={{ color: '#722ed1', fontSize: 11 }}>{formatVND(data.revenueUsedThisMonth)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>↳ No-show</Text>
                  <Text style={{ color: '#8c8c8c', fontSize: 11 }}>{formatVND(data.revenueNoShowThisMonth)}</Text>
                </div>
              </Space>
            }
          />
        </Col>

        {/* Tổng booking */}
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tổng Đơn Đặt Vé"
            value={data.totalBookings.toLocaleString('vi-VN')}
            icon={<ShoppingCartOutlined />}
            accentColor="#52c41a"
            footer={
              <Space wrap size={6}>
                <Badge color="#52c41a" text={<Text style={{ fontSize: 11, color: '#52c41a' }}>Thành công: {statusBreakdown.SUCCESS || 0}</Text>} />
                <Badge color="#722ed1" text={<Text style={{ fontSize: 11, color: '#722ed1' }}>Đã dùng: {statusBreakdown.USED || 0}</Text>} />
                <Badge color="#faad14" text={<Text style={{ fontSize: 11, color: '#faad14' }}>Chờ TT: {statusBreakdown.PENDING || 0}</Text>} />
                <Badge color="#ff4d4f" text={<Text style={{ fontSize: 11, color: '#ff4d4f' }}>Đã hủy: {statusBreakdown.CANCELLED || 0}</Text>} />
                {(statusBreakdown.NO_SHOW > 0) && (
                  <Badge color="#8c8c8c" text={<Text style={{ fontSize: 11, color: '#8c8c8c' }}>No-show: {statusBreakdown.NO_SHOW}</Text>} />
                )}
              </Space>
            }
          />
        </Col>

        {/* Tỷ lệ hủy */}
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tỷ Lệ Hủy Vé"
            value={`${data.cancelRate}%`}
            icon={<CloseCircleOutlined />}
            accentColor="#ff4d4f"
            footer={
              <div>
                <Progress percent={data.cancelRate} size="small" strokeColor="#ff4d4f" trailColor="#fff1f0" showInfo={false} />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {statusBreakdown.CANCELLED || 0} / {totalBookings} đơn bị hủy
                </Text>
              </div>
            }
          />
        </Col>

        {/* Tỷ lệ lấp đầy ghế */}
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Tỷ Lệ Lấp Đầy Ghế"
            value={`${data.occupancyRate}%`}
            icon={<PieChartOutlined />}
            accentColor="#722ed1"
            footer={
              <div>
                <Progress percent={data.occupancyRate} size="small"
                  strokeColor={{ from: '#9254de', to: '#722ed1' }} trailColor="#f9f0ff" showInfo={false} />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {data.occupancyRate >= 80 ? '🔥 Rất tốt' : data.occupancyRate >= 50 ? '👍 Khá tốt' : '⚠️ Cần cải thiện'}
                </Text>
              </div>
            }
          />
        </Col>
      </Row>

      {/* ── ROW 2: Biểu đồ doanh thu + Người dùng ────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>

        {/* Biểu đồ doanh thu 6 tháng */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
            title={
              <Space>
                <RiseOutlined style={{ color: '#1677ff' }} />
                <span style={{ fontWeight: 700 }}>Doanh Thu 6 Tháng Gần Nhất</span>
              </Space>
            }
            extra={
              data.revenueTrend !== null && (
                <Tag color={data.revenueTrend >= 0 ? 'success' : 'error'} style={{ borderRadius: 20 }}>
                  {data.revenueTrend >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {' '}{data.revenueTrend >= 0 ? '+' : ''}{data.revenueTrend}% MoM
                </Tag>
              )
            }
          >
            <RevenueBarChart data={data.monthlyRevenue} />
            <Divider style={{ margin: '12px 0 8px' }} />
            <Row gutter={16} style={{ textAlign: 'center' }}>
              <Col span={8}>
                <Statistic title="Tháng này" value={data.revenueThisMonth}
                  formatter={v => <span style={{ fontSize: 14 }}>{Number(v).toLocaleString('vi-VN')} ₫</span>}
                  valueStyle={{ color: '#1677ff', fontSize: 14 }} />
              </Col>
              <Col span={8}>
                <Statistic title="Tháng trước" value={data.revenueLastMonth}
                  formatter={v => <span style={{ fontSize: 14 }}>{Number(v).toLocaleString('vi-VN')} ₫</span>}
                  valueStyle={{ color: '#8c8c8c', fontSize: 14 }} />
              </Col>
              <Col span={8}>
                <Statistic title="Tổng tích lũy" value={data.totalRevenue}
                  formatter={v => <span style={{ fontSize: 14 }}>{Number(v).toLocaleString('vi-VN')} ₫</span>}
                  valueStyle={{ color: '#52c41a', fontSize: 14 }} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Người dùng */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%' }}
            title={
              <Space>
                <TeamOutlined style={{ color: '#13c2c2' }} />
                <span style={{ fontWeight: 700 }}>Người Dùng</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size={20}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: '#13c2c2', lineHeight: 1 }}>
                  {data.totalUsers.toLocaleString('vi-VN')}
                </div>
                <Text type="secondary" style={{ fontSize: 13 }}>Tổng người dùng</Text>
              </div>

              <Divider style={{ margin: '0' }} />

              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#e6fffb', borderRadius: 12, padding: '14px 18px'
              }}>
                <UserAddOutlined style={{ fontSize: 28, color: '#13c2c2' }} />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#13c2c2' }}>
                    +{data.newUsersThisMonth.toLocaleString('vi-VN')}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Đăng ký tháng này</Text>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12 }}>Tăng trưởng tháng này</Text>
                  <Text strong style={{ fontSize: 12, color: '#13c2c2' }}>
                    {data.totalUsers > 0
                      ? ((data.newUsersThisMonth / data.totalUsers) * 100).toFixed(1)
                      : 0}%
                  </Text>
                </div>
                <Progress
                  percent={data.totalUsers > 0 ? Math.round((data.newUsersThisMonth / data.totalUsers) * 100) : 0}
                  strokeColor={{ from: '#36cfc9', to: '#13c2c2' }}
                  trailColor="#e6fffb" size="small" showInfo={false}
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* ── ROW 3: Tình trạng vé + Top phim ──────────────────── */}
      <Row gutter={[20, 20]}>

        {/* Tình trạng vé */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%' }}
            title={
              <Space>
                <PieChartOutlined style={{ color: '#1677ff' }} />
                <span style={{ fontWeight: 700 }}>Tình Trạng Đặt Vé</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size={18}>
              <StatusRow
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                label="Thành công" count={statusBreakdown.SUCCESS || 0}
                total={totalBookings} color="#52c41a" trailColor="#f6ffed"
              />
              <StatusRow
                icon={<CheckSquareOutlined style={{ color: '#722ed1' }} />}
                label="Đã sử dụng" count={statusBreakdown.USED || 0}
                total={totalBookings} color="#722ed1" trailColor="#f9f0ff"
              />
              <StatusRow
                icon={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                label="Chờ thanh toán" count={statusBreakdown.PENDING || 0}
                total={totalBookings} color="#faad14" trailColor="#fffbe6"
              />
              <StatusRow
                icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                label="Đã hủy" count={statusBreakdown.CANCELLED || 0}
                total={totalBookings} color="#ff4d4f" trailColor="#fff1f0"
              />
              <StatusRow
                icon={<MinusOutlined style={{ color: '#8c8c8c' }} />}
                label="Vắng mặt (No-show)" count={statusBreakdown.NO_SHOW || 0}
                total={totalBookings} color="#8c8c8c" trailColor="#f5f5f5"
              />

              <Divider style={{ margin: '4px 0' }} />

              <div style={{ textAlign: 'center' }}>
                <Statistic
                  title="Tỷ lệ thành công (Success + Used)"
                  value={successRate}
                  suffix="%"
                  valueStyle={{ color: '#52c41a', fontWeight: 800, fontSize: 30 }}
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Top phim */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>

            {/* Top bán chạy */}
            <Card
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
              title={
                <Space>
                  <FireOutlined style={{ color: '#ff4d4f' }} />
                  <span style={{ fontWeight: 700 }}>Top 5 Phim Bán Chạy Nhất</span>
                  <Tag color="red" style={{ borderRadius: 20 }}><TrophyOutlined /> HOT</Tag>
                </Space>
              }
            >
              <Table
                dataSource={data.topMovies}
                columns={topMoviesColumns}
                rowKey="id"
                pagination={false}
                size="middle"
                rowClassName={(_, i) => (i === 0 ? 'top-movie-row-gold' : '')}
                style={{ borderRadius: 8, overflow: 'hidden' }}
              />
            </Card>

            {/* Top đánh giá */}
            <Card
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
              title={
                <Space>
                  <StarOutlined style={{ color: '#faad14', fontSize: 18 }} />
                  <span style={{ fontWeight: 700 }}>Top 5 Phim Đánh Giá Cao Nhất</span>
                  <Tag color="gold" style={{ borderRadius: 20 }}><StarFilled /> NỔI BẬT</Tag>
                </Space>
              }
            >
              <Table
                dataSource={data.topRatedMovies}
                columns={topRatedColumns}
                rowKey="id"
                pagination={false}
                size="middle"
                rowClassName={(_, i) => (i === 0 ? 'top-movie-row-gold' : '')}
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