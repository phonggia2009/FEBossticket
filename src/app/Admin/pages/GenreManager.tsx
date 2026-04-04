import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../../common/api/adminAPI';

const GenreManager = () => {
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchGenres = async () => {
    const res = await getGenres();
    setGenres(res.data.data.genres); // Theo format responseHelper.js
  };

  useEffect(() => { fetchGenres(); }, []);

  const handleSave = async (values: { name: string }) => {
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, values.name);
        message.success('Cập nhật thành công');
      } else {
        await createGenre(values.name);
        message.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
      fetchGenres();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên thể loại', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => { 
              setEditingGenre(record); 
              form.setFieldsValue(record); 
              setIsModalOpen(true); 
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa thể loại "${record.name}"?`}
            onConfirm={async () => {
              try {
                await deleteGenre(record.id); // Gọi API xóa
                message.success('Xóa thể loại thành công');
                fetchGenres(); // Load lại danh sách
              } catch (err) {
                message.error('Không thể xóa thể loại này vì đang có phim thuộc thể loại này');
              }
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setEditingGenre(null); form.resetFields(); setIsModalOpen(true); }} style={{ marginBottom: 16 }}>
        Thêm thể loại mới
      </Button>
      <Table dataSource={genres} columns={columns} rowKey="id" />
      
      <Modal title={editingGenre ? "Sửa thể loại" : "Thêm thể loại"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item name="name" label="Tên thể loại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GenreManager;