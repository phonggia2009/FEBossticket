// src/app/Admin/pages/Point/components/AdjustPointModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Alert } from 'antd';
import type { UserBasic } from '../type';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { amount: number; reason: string }) => void;
  loading: boolean;
  user: UserBasic | null;
}

const AdjustPointModal: React.FC<Props> = ({ open, onClose, onSubmit, loading, user }) => {
  const [form] = Form.useForm();

  // Reset form mỗi khi mở modal mới
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      title="Điều chỉnh điểm thủ công"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {user && (
        <Alert 
          message={`Khách hàng: ${user.fullName} (${user.email})`} 
          type="info" 
          showIcon 
          className="mb-4"
        />
      )}

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Số điểm muốn điều chỉnh (Nhập số âm để trừ điểm)"
          name="amount"
          rules={[{ required: true, message: 'Vui lòng nhập số điểm!' }]}
        >
          <InputNumber 
            className="w-full" 
            placeholder="Ví dụ: 50 (Cộng 50đ) hoặc -20 (Trừ 20đ)" 
          />
        </Form.Item>

        <Form.Item
          label="Lý do điều chỉnh (Bắt buộc)"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do để đối soát!' }]}
        >
          <Input.TextArea rows={3} placeholder="Ví dụ: Tặng điểm sinh nhật khách hàng..." />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} disabled={loading}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Xác nhận
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdjustPointModal;