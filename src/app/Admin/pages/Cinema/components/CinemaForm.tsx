// src/app/Admin/components/CinemaForm.tsx
import { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createCinema, updateCinema } from '../../../../../common/api/adminAPI';

interface CinemaFormProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingCinema: any;
}

const CinemaForm = ({ open, onCancel, onSuccess, editingCinema }: CinemaFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingCinema) {
        form.setFieldsValue(editingCinema);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingCinema, form]);

  const onFinish = async (values: any) => {
    try {
      if (editingCinema) {
        await updateCinema(editingCinema.id, values);
        message.success('Cập nhật rạp thành công');
      } else {
        await createCinema(values);
        message.success('Thêm rạp mới thành công');
      }
      onSuccess();
    } catch (err: any) {
      message.error('Lỗi: ' + (err.response?.data?.message || 'Không thể lưu thông tin rạp'));
    }
  };

  return (
    <Modal
      title={editingCinema ? "Chỉnh sửa rạp" : "Thêm rạp mới"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="cinema_name" label="Tên rạp" rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}>
          <Input placeholder="Ví dụ: CGV Vincom Bà Triệu" />
        </Form.Item>
        <Form.Item name="city" label="Thành phố">
          <Input placeholder="Ví dụ: Hà Nội" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input placeholder="Số 191 Bà Triệu, Hai Bà Trưng" />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input placeholder="024 1234 5678" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CinemaForm;