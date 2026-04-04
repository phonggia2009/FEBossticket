// src/app/Admin/pages/Seat/components/PaintToolbar.tsx

import React from 'react';
import { Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { SeatType } from '../type';
import { SEAT_TYPE_CONFIG, ALL_SEAT_TYPES } from '../constants';

interface Props {
  paintType: SeatType;
  onChange: (type: SeatType) => void;
}

const PaintToolbar: React.FC<Props> = ({ paintType, onChange }) => (
  <Card title="Công cụ chỉnh ghế" size="small">
    <p className="text-xs text-gray-500 mb-3">
      <InfoCircleOutlined className="mr-1" />
      Click hoặc <strong>kéo vùng chọn</strong> để đổi loại ghế.
    </p>
    <div className="space-y-2">
      {ALL_SEAT_TYPES.map(type => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left ${
            paintType === type
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span
            className="w-5 h-5 rounded flex-shrink-0 border-2"
            style={{
              background: SEAT_TYPE_CONFIG[type].bg,
              borderColor: SEAT_TYPE_CONFIG[type].border,
            }}
          />
          <span className="text-sm font-medium">{SEAT_TYPE_CONFIG[type].label}</span>
          {type === 'COUPLE' && (
            <span className="text-xs text-purple-500 ml-auto">×2 ô</span>
          )}
          {paintType === type && (
            <span className="text-xs text-blue-600 ml-auto font-bold">✓ Đang dùng</span>
          )}
        </button>
      ))}
    </div>
  </Card>
);

export default PaintToolbar;