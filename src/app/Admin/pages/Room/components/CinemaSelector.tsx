// src/app/Admin/pages/Room/components/CinemaSelector.tsx

import React from 'react';
import { Card, Select } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import type { Cinema } from '../type';

interface Props {
  cinemas: Cinema[];
  selectedCinemaId: number | null;
  onChange: (id: number) => void;
}

const CinemaSelector: React.FC<Props> = ({ cinemas, selectedCinemaId, onChange }) => (
  <Card className="mb-6 shadow-sm border-blue-100">
    <div className="flex items-center gap-4">
      <span className="font-medium"><HomeOutlined /> Chọn rạp chiếu:</span>
      <Select
        placeholder="-- Vui lòng chọn rạp để xem danh sách phòng --"
        style={{ width: 400 }}
        value={selectedCinemaId}
        onChange={onChange}
        options={cinemas.map((c) => ({ label: c.cinema_name, value: c.id }))}
      />
    </div>
  </Card>
);

export default CinemaSelector;