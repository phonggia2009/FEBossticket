import React from 'react';
import { Card, Tag, Space, Typography, Button, Popconfirm, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Showtime } from '../type';
import { STATUS_CONFIG } from '../constants';
import { groupByDate, getShowtimeStatus, formatVND, formatEndTime } from '../utils';

const { Text } = Typography;

interface Props {
  showtimes: Showtime[];
  onEdit:    (record: Showtime) => void;
  onDelete:  (record: Showtime) => void;
}

const ShowtimeCalendar: React.FC<Props> = ({ showtimes, onEdit, onDelete }) => {
  const activeShowtimes = showtimes.filter(s => {
    const status = s.movie?.duration
      ? getShowtimeStatus(s.start_time, s.movie.duration)
      : 'upcoming';
      
    // Chỉ giữ lại những suất chiếu "Sắp chiếu" hoặc "Đang chiếu"
   return status === 'upcoming' || status === 'ongoing';
  });

  const grouped = groupByDate(activeShowtimes);
  
  const dates = Object.keys(grouped).sort((a, b) => {
    const parse = (s: string) => {
      const [d, m, y] = s.split('/');
      return new Date(`${y}-${m}-${d}`).getTime();
    };
    return parse(a) - parse(b);
  });

  if (dates.length === 0) {
    return <Empty description="Không có lịch chiếu nào sắp tới hoặc đang chiếu" style={{ padding: '40px 0' }} />;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      {dates.map(date => (
        <Card
          key={date}
          size="small"
          styles={{ header: { background: 'linear-gradient(90deg, #1677ff 0%, #4096ff 100%)', borderRadius: '8px 8px 0 0' } }}
          title={
            <Text strong style={{ color: '#fff', fontSize: 14 }}>
              📅 {date}
            </Text>
          }
          style={{ borderRadius: 10, overflow: 'hidden' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {grouped[date].map(s => {
              // Vẫn tính lại status để lấy màu sắc từ STATUS_CONFIG
              const status = s.movie?.duration
                ? getShowtimeStatus(s.start_time, s.movie.duration)
                : 'upcoming';
              const cfg = STATUS_CONFIG[status];

              return (
                <div
                  key={s.id}
                  style={{
                    display:         'flex',
                    alignItems:      'center',
                    gap:             12,
                    padding:         '10px 12px',
                    borderRadius:    8,
                    background:      '#fafafa',
                    border:          '1px solid #f0f0f0',
                  }}
                >
                  {/* Time */}
                  <div style={{ minWidth: 50, textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 18, lineHeight: 1 }}>
                      {new Date(s.start_time).toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  </div>

                  {/* Movie info */}
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: 13, display: 'block' }}>
                      {s.movie?.title ?? '—'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {s.room?.cinema?.cinema_name} · {s.room?.room_name}
                      {s.movie?.duration ? ` · ${s.movie.duration} phút` : ''}
                    </Text>
                    {s.movie?.duration && (
                      <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        <ClockCircleOutlined style={{ marginRight: 3 }} />
                        Kết thúc: {formatEndTime(s.start_time, s.movie.duration)}
                      </Text>
                    )}
                  </div>

                  {/* Price + Status (Đã cập nhật Cách 2 hiển thị nhiều mức giá) */}
                  <Space direction="vertical" size={6} style={{ textAlign: 'right', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end', maxWidth: '200px' }}>
                      {s.seat_prices && s.seat_prices.length > 0 ? (
                        s.seat_prices.map((sp: any, index: number) => {
                          let color = 'default';
                          let label = sp.seat_type;
                          
                          if (sp.seat_type === 'NORMAL') { color = 'blue'; label = 'Thường'; }
                          else if (sp.seat_type === 'VIP') { color = 'gold'; label = 'VIP'; }
                          else if (sp.seat_type === 'COUPLE') { color = 'magenta'; label = 'Ghế đôi'; }

                          return (
                            <Tag color={color} key={index} style={{ margin: 0 }}>
                              {label}: <strong>{formatVND(sp.price)}</strong>
                            </Tag>
                          );
                        })
                      ) : (
                        <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>Chưa có giá</Text>
                      )}
                    </div>
                    <Tag color={cfg.color} style={{ margin: 0 }}>{cfg.label}</Tag>
                  </Space>

                  {/* Actions */}
                  <Space size={4}>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => onEdit(s)}
                      style={{ color: '#1677ff' }}
                    />
                    <Popconfirm
                      title="Xóa suất chiếu này?"
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => onDelete(s)}
                    >
                      <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                  </Space>
                </div>
              );
            })}
          </Space>
        </Card>
      ))}
    </Space>
  );
};

export default ShowtimeCalendar;