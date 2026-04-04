// src/app/Admin/pages/Users/components/UserModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Select, Typography, Space, Avatar } from 'antd';
import { UserOutlined, SwapOutlined } from '@ant-design/icons';
import type { User, UserRole } from '../type';
import { ROLE_LABELS, ROLE_COLORS } from '../constants';

const { Text } = Typography;

interface Props {
  open:        boolean;
  target:      User | null;
  submitting:  boolean;
  onConfirm:   (role: UserRole) => void;
  onCancel:    () => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
  { value: 'USER',  label: 'Người dùng (USER)' },
];

const UserModal: React.FC<Props> = ({ open, target, submitting, onConfirm, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');

  useEffect(() => {
    if (target) setSelectedRole(target.role);
  }, [target]);

  return (
    <Modal
      open={open}
      title={
        <Space>
          <SwapOutlined />
          Thay đổi quyền người dùng
        </Space>
      }
      okText="Cập nhật"
      cancelText="Hủy"
      onOk={() => onConfirm(selectedRole)}
      onCancel={onCancel}
      confirmLoading={submitting}
      okButtonProps={{ disabled: selectedRole === target?.role }}
      width={440}
      destroyOnClose
    >
      {target && (
        <Space direction="vertical" style={{ width: '100%', padding: '8px 0' }} size={16}>
          {/* Thông tin user */}
          <Space align="center">
            <Avatar
              size={48}
              src={target.avatarUrl}
              icon={<UserOutlined />}
              style={{ background: '#1677ff' }}
            />
            <div>
              <div><Text strong style={{ fontSize: 15 }}>{target.fullName}</Text></div>
              <div><Text type="secondary">{target.email}</Text></div>
            </div>
          </Space>

          {/* Chọn role */}
          <div>
            <Text strong>Quyền mới:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={selectedRole}
              options={ROLE_OPTIONS}
              onChange={val => setSelectedRole(val)}
            />
          </div>

          {selectedRole !== target.role && (
            <Text type="warning" style={{ fontSize: 12 }}>
              ⚠️ Đang thay đổi từ <b>{ROLE_LABELS[target.role]}</b> → <b>{ROLE_LABELS[selectedRole]}</b>
            </Text>
          )}
        </Space>
      )}
    </Modal>
  );
};

export default UserModal;