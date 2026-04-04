// src/app/Admin/pages/Seat/components/ActionButtons.tsx

import React from 'react';
import { Button, Popconfirm } from 'antd';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
  saving: boolean;
  onSave: () => void;
  onDeleteAll: () => void;
}

const ActionButtons: React.FC<Props> = ({ saving, onSave, onDeleteAll }) => (
  <div className="space-y-2">
    <Button
      type="primary"
      icon={<SaveOutlined />}
      onClick={onSave}
      loading={saving}
      block
      size="large"
    >
      Lưu sơ đồ ghế
    </Button>
    <Popconfirm
      title="Xóa toàn bộ ghế?"
      description="Hành động này không thể hoàn tác!"
      onConfirm={onDeleteAll}
      okText="Xóa hết"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <Button danger icon={<DeleteOutlined />} block>
        Xóa & làm lại
      </Button>
    </Popconfirm>
  </div>
);

export default ActionButtons;