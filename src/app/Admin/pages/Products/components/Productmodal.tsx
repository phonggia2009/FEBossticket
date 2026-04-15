// src/app/Admin/pages/Products/components/ProductModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Input, InputNumber, Select,
  Switch, Upload, Typography, Row, Col, Divider,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { Product, ProductFormValues, ProductType } from '../type';
import { PRODUCT_TYPE_ICONS } from '../constants';

const { Text }     = Typography;
const { TextArea } = Input;

interface Props {
  open:       boolean;
  editTarget: Product | null;
  submitting: boolean;
  onSubmit:   (values: ProductFormValues, imageFile?: File) => void;
  onCancel:   () => void;
}

const TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: 'FOOD',  label: `${PRODUCT_TYPE_ICONS.FOOD}  Đồ ăn` },
  { value: 'DRINK', label: `${PRODUCT_TYPE_ICONS.DRINK}  Đồ uống` },
  { value: 'COMBO', label: `${PRODUCT_TYPE_ICONS.COMBO}  Combo` },
];

const ProductModal: React.FC<Props> = ({ open, editTarget, submitting, onSubmit, onCancel }) => {
  const [form]      = Form.useForm<ProductFormValues>();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [preview,   setPreview]   = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editTarget) {
      form.setFieldsValue({
        product_name: editTarget.product_name,
        price:        Number(editTarget.price),
        type:         editTarget.type,
        quantity:     editTarget.quantity,
        description:  editTarget.description ?? '',
        isAvailable:  editTarget.isAvailable,
      });
      setPreview(editTarget.imageUrl);
    } else {
      form.resetFields();
      form.setFieldsValue({ isAvailable: true, type: 'FOOD', quantity: 0 });
      setPreview(null);
    }
    setImageFile(undefined);
  }, [open, editTarget]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values, imageFile);
    } catch { /* Ant Design tự hiển thị lỗi */ }
  };

  const beforeUpload = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    return false; // chặn auto upload
  };

  return (
    <Modal
      open={open}
      title={editTarget ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm'}
      okText={editTarget ? 'Cập nhật' : 'Tạo sản phẩm'}
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      width={580}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
        {/* Ảnh sản phẩm */}
        <Form.Item label={<Text strong>Ảnh sản phẩm</Text>}>
          <Upload.Dragger
            accept="image/*"
            showUploadList={false}
            beforeUpload={beforeUpload}
            style={{ padding: '8px 0' }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }}
              />
            ) : (
              <>
                <p><InboxOutlined style={{ fontSize: 32, color: '#1677ff' }} /></p>
                <p>Kéo thả hoặc click để chọn ảnh</p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>

        {/* Tên sản phẩm */}
        <Form.Item
          name="product_name"
          label={<Text strong>Tên sản phẩm</Text>}
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder="VD: Bắp rang bơ size L..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="type"
              label={<Text strong>Loại</Text>}
              rules={[{ required: true, message: 'Chọn loại' }]}
            >
              <Select options={TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="price"
              label={<Text strong>Giá (VNĐ)</Text>}
              rules={[{ required: true, message: 'Nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1000}
                formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={val => Number(val?.replace(/\./g, '') || 0) as any}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="quantity"
              label={<Text strong>Tồn kho</Text>}
              rules={[{ required: true, message: 'Nhập số lượng' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={<Text strong>Mô tả</Text>}>
          <TextArea rows={3} placeholder="Mô tả sản phẩm (không bắt buộc)..." />
        </Form.Item>

        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          name="isAvailable"
          label={<Text strong>Trạng thái</Text>}
          valuePropName="checked"
        >
          <Switch checkedChildren="Đang bán" unCheckedChildren="Đã ẩn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;