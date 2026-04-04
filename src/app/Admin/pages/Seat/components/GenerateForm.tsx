// src/app/Admin/pages/Seat/components/GenerateForm.tsx

import React from 'react';
import { Button, InputNumber, Form, Card } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

interface Props {
  onFinish: (values: { rows: number; cols: number }) => void;
}

const GenerateForm: React.FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Card
      title={<span><AppstoreAddOutlined className="mr-2" />Tạo sơ đồ mới</span>}
      size="small"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="rows"
          label="Số hàng (A, B, C...)"
          rules={[{ required: true }]}
          initialValue={8}
        >
          <InputNumber min={1} max={26} className="w-full" />
        </Form.Item>
        <Form.Item
          name="cols"
          label="Số ghế mỗi hàng"
          rules={[{ required: true }]}
          initialValue={10}
        >
          <InputNumber min={2} max={30} step={2} className="w-full" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block icon={<AppstoreAddOutlined />}>
          Tạo sơ đồ
        </Button>
      </Form>
    </Card>
  );
};

export default GenerateForm;