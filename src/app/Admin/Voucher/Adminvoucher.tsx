import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Switch, message, Space, Tag, Typography, Upload 
} from 'antd';
import { UploadOutlined } from '@ant-design/icons'; // Import icon Upload
import { getAllVouchers, createVoucher, toggleVoucherStatus } from '../../../common/api/adminAPI';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface Voucher {
  id: number;
  code: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  max_discount?: number;
  min_order_value: number;
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

  // HÀM NÀY ĐÃ ĐƯỢC CẬP NHẬT ĐỂ DÙNG FORMDATA
  const handleAdd = async (values: any) => {
    try {
      const formData = new FormData();
      
      // 1. Thêm các dữ liệu text thông thường
      formData.append('title', values.title);
      formData.append('code', values.code);
      if (values.description) formData.append('description', values.description);
      if (values.tag) formData.append('tag', values.tag);
      formData.append('discount_type', values.discount_type);
      formData.append('discount_value', values.discount_value);
      formData.append('min_order_value', values.min_order_value);
      if (values.max_discount) formData.append('max_discount', values.max_discount);
      formData.append('usage_limit', values.usage_limit);
      
      // Format ngày tháng chuẩn ISO
      formData.append('start_date', values.dates[0].toISOString());
      formData.append('end_date', values.dates[1].toISOString());

      // 2. Xử lý lấy file Ảnh
      if (values.image && values.image.fileList && values.image.fileList.length > 0) {
        const file = values.image.fileList[0].originFileObj;
        formData.append('image', file); // 'image' phải khớp với tên field trong multer
      }

      // 3. Gửi FormData lên API
      await createVoucher(formData as any);
      
      message.success('Tạo chương trình khuyến mãi thành công!');
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
      title: 'Chương trình / Mã', 
      key: 'info',
      render: (_: any, record: Voucher) => (
        <div className="flex items-center gap-3">
          {/* Hiển thị ảnh thumbnail nhỏ gọn trong bảng */}
          {record.image ? (
            <img src={record.image} alt={record.title} className="w-12 h-12 rounded object-cover border border-gray-200" />
          ) : (
            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center border border-gray-200 text-xs text-gray-400">
              No Img
            </div>
          )}
          <div>
            <div className="font-bold text-gray-800 text-sm mb-1">{record.title}</div>
            <Space size="small">
              <Tag color="blue" className="text-xs font-bold m-0">{record.code}</Tag>
              {record.tag && <Tag color="volcano" className="m-0 text-xs">{record.tag}</Tag>}
            </Space>
          </div>
        </div>
      )
    },
    { 
      title: 'Thiết lập giảm', 
      key: 'discount',
      render: (_: any, record: Voucher) => (
        <div className="text-sm">
          <span className="font-bold text-red-500 block mb-1">
            {record.discount_type === 'FIXED' 
              ? `Giảm ${record.discount_value.toLocaleString()} ₫` 
              : `Giảm ${record.discount_value}%`}
          </span>
          <Text type="secondary" className="text-xs">
            Đơn tối thiểu: {record.min_order_value?.toLocaleString() || 0} ₫
          </Text>
        </div>
      )
    },
    { 
      title: 'Đã dùng', 
      key: 'usage',
      render: (_: any, record: Voucher) => (
        <span className="font-medium text-gray-700">{record.used_count} / {record.usage_limit}</span>
      )
    },
    { 
      title: 'Hiệu lực', 
      key: 'duration',
      render: (_: any, record: Voucher) => (
        <div className="text-xs text-gray-500">
          <div><strong className="text-emerald-600">Từ:</strong> {dayjs(record.start_date).format('DD/MM/YY HH:mm')}</div>
          <div><strong className="text-red-500">Đến:</strong> {dayjs(record.end_date).format('DD/MM/YY HH:mm')}</div>
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

  // Hàm hỗ trợ Component Upload lấy đúng file (Antd convention)
  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} style={{ margin: 0 }}>🎟️ Quản lý Mã giảm giá</Title>
        <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
          + Tạo chương trình mới
        </Button>
      </div>

      <Table 
        dataSource={vouchers} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal 
        title={<Title level={4}>Tạo chương trình khuyến mãi mới</Title>}
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
        width={750} 
        style={{ top: 20 }}
      >
        <div className="max-h-[75vh] overflow-y-auto pr-3 mt-4">
          <Form form={form} layout="vertical" onFinish={handleAdd}>
            
            {/* KHU VỰC 1: THÔNG TIN HIỂN THỊ */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
              <h4 className="font-bold text-gray-600 mb-4 tracking-wide uppercase text-sm">
                1. Giao diện hiển thị (Dành cho Khách hàng)
              </h4>
              
              <Form.Item name="title" label="Tiêu đề chương trình" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                <Input placeholder="VD: Thứ 3 Vui Vẻ - Đồng Giá 50K" size="large" />
              </Form.Item>

              <Form.Item name="description" label="Mô tả chi tiết">
                <Input.TextArea rows={2} placeholder="Nhập nội dung quảng cáo, điều kiện áp dụng cho khách hàng đọc..." size="large" />
              </Form.Item>

              <Space size="large" className="w-full flex">
                <Form.Item name="code" label="Mã nhập (Voucher Code)" rules={[{ required: true, message: 'Vui lòng nhập mã!' }]} className="flex-1">
                  <Input placeholder="VD: BOSSTICKET2026" size="large" className="uppercase font-bold text-red-500" />
                </Form.Item>

                <Form.Item name="tag" label="Nhãn thẻ (Tag)" className="flex-1">
                  <Input placeholder="VD: HOT, Đồng Giá, Giảm 20%" size="large" />
                </Form.Item>
              </Space>

              {/* COMPONENT UPLOAD ẢNH MỚI */}
              <Form.Item 
                name="image" 
                label="Ảnh Banner Khuyến Mãi (Tỷ lệ khuyến nghị 16:9)" 
                valuePropName="fileList" 
                getValueFromEvent={normFile}
              >
                <Upload 
                  name="image" 
                  listType="picture" 
                  maxCount={1} 
                  beforeUpload={() => false} // Ngăn không cho Upload tự gọi API rác, chúng ta sẽ gọi API thủ công khi ấn nút Lưu
                  accept="image/png, image/jpeg, image/jpg"
                >
                  <Button icon={<UploadOutlined />}>Bấm để chọn ảnh tải lên</Button>
                </Upload>
              </Form.Item>
            </div>

            {/* KHU VỰC 2: CẤU HÌNH LOGIC GIẢM GIÁ */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg mb-6">
              <h4 className="font-bold text-blue-800 mb-4 tracking-wide uppercase text-sm">
                2. Thiết lập điều kiện giảm giá
              </h4>

              <Space size="large" className="w-full flex">
                <Form.Item name="discount_type" label="Hình thức giảm" rules={[{ required: true }]} className="flex-1">
                  <Select size="large" options={[
                    { label: 'Giảm theo Phần trăm (%)', value: 'PERCENTAGE' }, 
                    { label: 'Giảm số tiền Cố định (VNĐ)', value: 'FIXED' }
                  ]} />
                </Form.Item>
                <Form.Item name="discount_value" label="Giá trị giảm" rules={[{ required: true }]} className="flex-1">
                  <InputNumber size="large" min={1} className="w-full" />
                </Form.Item>
              </Space>

              <Space size="large" className="w-full flex">
                <Form.Item name="min_order_value" label="Giá trị đơn hàng tối thiểu (VNĐ)" initialValue={0} className="flex-1">
                  <InputNumber size="large" min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="max_discount" label="Giảm tối đa (Chỉ dùng cho giảm %)" className="flex-1">
                  <InputNumber size="large" min={0} className="w-full" placeholder="Bỏ trống nếu không giới hạn" />
                </Form.Item>
              </Space>
              
              <Form.Item name="usage_limit" label="Số lượng mã phát hành" initialValue={100}>
                <InputNumber size="large" min={1} className="w-full" />
              </Form.Item>

              <Form.Item name="dates" label="Thời gian diễn ra chương trình" rules={[{ required: true }]}>
                <RangePicker showTime size="large" className="w-full" />
              </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" size="large" block className="h-12 text-base font-bold bg-red-600 hover:bg-red-500 border-none rounded-lg shadow-md">
              Lưu & Phát hành Mã Khuyến Mãi
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminVoucher;