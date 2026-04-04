// src/app/Admin/pages/Seat/components/SeatStats.tsx

import React from 'react';
import { Card, Tag } from 'antd';
import type { Seat, SeatType } from '../type';
import { SEAT_TYPE_CONFIG, ALL_SEAT_TYPES } from '../constants';
import { calcStats } from '../utils';

interface Props {
  seats: Seat[];
}

const TAG_COLOR: Record<SeatType, string> = {
  NORMAL: 'default',
  VIP: 'gold',
  COUPLE: 'purple',
};

const SeatStats: React.FC<Props> = ({ seats }) => {
  const stats = calcStats(seats);

  return (
    <Card title="Thống kê" size="small">
      <div className="space-y-2">
        {ALL_SEAT_TYPES.map(type => (
          <div key={type} className="flex justify-between items-center">
            <Tag color={TAG_COLOR[type]}>{SEAT_TYPE_CONFIG[type].label}</Tag>
            <span className="font-bold">{stats[type]} ghế</span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Tổng cộng</span>
          <span>{seats.length} ghế</span>
        </div>
      </div>
    </Card>
  );
};

export default SeatStats;