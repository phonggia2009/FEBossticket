import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Switch, message, Space, Tag, Typography 
} from 'antd';
import { getAllVouchers, createVoucher, toggleVoucherStatus } from '../../../common/api/adminAPI';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface Voucher {
  id: number;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const AdminVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await getAllVouchers();
      setVouchers(res.data?.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh sách Voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      const payload = {
        ...values,
        start_date: values.dates[0].toISOString(),
        end_date: values.dates[1].toISOString(),
      };
      await createVoucher(payload);
      message.success('Tạo mã giảm giá thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchVouchers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi tạo mã');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleVoucherStatus(id);
      message.success('Cập nhật trạng thái thành công');
      fetchVouchers();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const columns = [
    { 
      title: 'Mã Voucher', 
      dataIndex: 'code', 
      key: 'code',
      render: (text: string) => <Tag color="blue" className="text-base font-bold">{text}</Tag> 
    },
    { 
      title: 'Loại giảm', 
      key: 'discount',
      render: (_: any, record: Voucher) => (
        <span className="font-semibold text-red-500">
          {record.discount_type === 'FIXED' 
            ? `${record.discount_value.toLocaleString()} ₫` 
            : `${record.discount_value}%`}
        </span>
      )
    },
    { 
      title: 'Đã dùng', 
      key: 'usage',
      render: (_: any, record: Voucher) => (
        <span>{record.used_count} / {record.usage_limit}</span>
      )
    },
    { 
      title: 'Hiệu lực', 
      key: 'duration',
      render: (_: any, record: Voucher) => (
        <div className="text-xs text-gray-500">
          <div>Từ: {dayjs(record.start_date).format('DD/MM/YYYY HH:mm')}</div>
          <div>Đến: {dayjs(record.end_date).format('DD/MM/YYYY HH:mm')}</div>
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'is_active', 
      key: 'is_active',
      render: (active: boolean, record: Voucher) => (
        <Switch checked={active} onChange={() => handleToggle(record.id)} />
      )
    }
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} style={{ margin: 0 }}>🎟️ Quản lý Mã giảm giá</Title>
        <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
          + Tạo mã mới
        </Button>
      </div>

      <Table 
        dataSource={vouchers} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal 
        title={<Title level={4}>Tạo mã giảm giá mới</Title>}
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} className="mt-4">
          <Form.Item name="code" label="Mã Voucher (Code)" rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
            <Input placeholder="VD: BOSSTICKET2026" size="large" className="uppercase" />
          </Form.Item>
          
          <Space size="large" className="w-full">
            <Form.Item name="discount_type" label="Loại giảm giá" rules={[{ required: true }]}>
              <Select size="large" style={{ width: 180 }} options={[
                { label: 'Phần trăm (%)', value: 'PERCENTAGE' }, 
                { label: 'Cố định (VND)', value: 'FIXED' }
              ]} />
            </Form.Item>
            <Form.Item name="discount_value" label="Giá trị giảm" rules={[{ required: true }]}>
              <InputNumber size="large" min={1} style={{ width: 180 }} />
            </Form.Item>
          </Space>

          <Space size="large" className="w-full">
            <Form.Item name="min_order_value" label="Đơn tối thiểu (VND)" initialValue={0}>
              <InputNumber size="large" min={0} style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="max_discount" label="Giảm tối đa (Tùy chọn)">
              <InputNumber size="large" min={0} style={{ width: 180 }} placeholder="Bỏ trống nếu không giới hạn" />
            </Form.Item>
          </Space>
          
          <Form.Item name="usage_limit" label="Giới hạn số lượng phát hành" initialValue={100}>
            <InputNumber size="large" min={1} className="w-full" />
          </Form.Item>

          <Form.Item name="dates" label="Thời gian áp dụng" rules={[{ required: true }]}>
            <RangePicker showTime size="large" className="w-full" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block className="mt-4 h-12 text-base font-bold bg-red-600 hover:bg-red-500 border-none">
            Phát hành mã
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminVoucher;