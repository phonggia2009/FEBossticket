// src/app/Admin/pages/Products/components/StockModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, InputNumber, Typography, Space, Tag } from 'antd';
import { StockOutlined } from '@ant-design/icons';
import type { Product } from '../type';

const { Text } = Typography;

interface Props {
  open:       boolean;
  target:     Product | null;
  submitting: boolean;
  onConfirm:  (quantity: number) => void;
  onCancel:   () => void;
}

const StockModal: React.FC<Props> = ({ open, target, submitting, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    if (target) setQuantity(target.quantity);
  }, [target]);

  return (
    <Modal
      open={open}
      title={
        <Space>
          <span>📦</span>
          Cập nhật tồn kho
        </Space>
      }
      okText="Cập nhật"
      cancelText="Hủy"
      onOk={() => onConfirm(quantity)}
      onCancel={onCancel}
      confirmLoading={submitting}
      width={380}
      destroyOnClose
    >
      {target && (
        <Space direction="vertical" style={{ width: '100%', padding: '8px 0' }} size={16}>
          <div>
            <Text strong style={{ fontSize: 15 }}>{target.product_name}</Text>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">Tồn kho hiện tại: </Text>
              <Tag color={target.quantity > 10 ? 'green' : target.quantity > 0 ? 'orange' : 'red'}>
                {target.quantity} sản phẩm
              </Tag>
            </div>
          </div>

          <div>
            <Text strong>Số lượng mới:</Text>
            <InputNumber
              style={{ width: '100%', marginTop: 8 }}
              min={0}
              value={quantity}
              onChange={val => setQuantity(val ?? 0)}
            />
          </div>
        </Space>
      )}
    </Modal>
  );
};

export default StockModal;