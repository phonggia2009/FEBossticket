// src/app/Admin/pages/Room/components/RoomForm.tsx

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { createRoom, updateRoom } from '../../../../../common/api/adminAPI';
import type { Cinema, Room } from '../type';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingRoom: Room | null;
  cinemas: Cinema[];
  selectedCinemaId: number | null;
}

const RoomForm: React.FC<Props> = ({ 
  open, onCancel, onSuccess, editingRoom, cinemas, selectedCinemaId 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingRoom) {
        form.setFieldsValue(editingRoom);
      } else {
        form.resetFields();
        if (selectedCinemaId) form.setFieldValue('cinema_id', selectedCinemaId);
      }
    }
  }, [open, editingRoom, selectedCinemaId, form]);

  const onFinish = async (values: any) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, values);
        message.success('Cập nhật phòng thành công');
      } else {
        await createRoom(values);
        message.success('Thêm phòng mới thành công');
      }
      onSuccess();
    } catch (err: any) {
      message.error('Lỗi: ' + (err.response?.data?.message || 'Không thể lưu phòng'));
    }
  };

  return (
    <Modal
      title={editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        {!editingRoom && (
          <Form.Item name="cinema_id" label="Thuộc rạp" rules={[{ required: true }]}>
            <Select placeholder="Chọn rạp chiếu">
              {cinemas.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.cinema_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="room_name" label="Tên phòng" rules={[{ required: true }]}>
          <Input placeholder="Ví dụ: Phòng chiếu 01" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomForm;