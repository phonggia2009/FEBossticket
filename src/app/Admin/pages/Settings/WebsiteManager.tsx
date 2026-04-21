import React, { useEffect, useState } from 'react';
import { Form, Switch, Select, Button, Card, message } from 'antd';
import { settingAPI, getMovies } from '../../../../common/api/adminAPI';

const WebsiteManager = () => {
  const [form] = Form.useForm();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [movieRes, settingRes] = await Promise.all([
        getMovies(1, 1000),
        settingAPI.getSettings()
      ]);

      // ✅ Fix: backend trả về { success, data: [...movies], pagination }
      // nên phải lấy movieRes.data.data mới là array phim
      setMovies(movieRes.data.data || []);

      form.setFieldsValue({
        maintenanceMode: settingRes.data.maintenanceMode,
        bannerMovies: settingRes.data.bannerMovies || [],
      });
    } catch (error) {
      message.error('Không tải được dữ liệu cấu hình');
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await settingAPI.updateSettings(values);
      message.success('Cập nhật cấu hình thành công!');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quản lý Website chung" className="m-4">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="maintenanceMode"
          label="Chế độ bảo trì (Bật lên sẽ khóa trang khách)"
          valuePropName="checked"
        >
          <Switch checkedChildren="BẬT" unCheckedChildren="TẮT" />
        </Form.Item>

        <Form.Item
          name="bannerMovies"
          label="Phim nổi bật trên Banner (Tối đa 3 phim)"
          rules={[
            { type: 'array', max: 3, message: 'Chỉ được chọn tối đa 3 bộ phim!' }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Tìm và chọn phim..."
            // ✅ movies giờ chắc chắn là array nên .map() không còn lỗi
            options={movies.map(m => ({ label: m.title, value: m.id }))}
            maxTagCount={3}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu Cấu Hình
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WebsiteManager;