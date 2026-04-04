// src/app/Admin/pages/Movie/MovieTrash.tsx

import React from 'react';
import { Table, Button, Space, Popconfirm, Image, Tag } from 'antd';
import { RollbackOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMovieTrash } from './useMovieTrash';
import type { Movie } from './type';

const MovieTrash = () => {
  const { trashData, loading, handleRestore } = useMovieTrash();

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'posterUrl',
      render: (url: string) => <Image src={url} width={50} fallback="https://via.placeholder.com/50x75" />,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { 
      title: 'Ngày xóa', 
      dataIndex: 'deletedAt', 
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm') 
    },
    { title: 'Trạng thái', render: () => <Tag color="error">Đã xóa</Tag> },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: Movie) => (
        <Space size="middle">
          <Popconfirm title="Khôi phục phim này?" onConfirm={() => handleRestore(record.id)}>
            <Button type="primary" ghost icon={<RollbackOutlined />}>Khôi phục</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-red-600">Thùng rác Phim</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>Quay lại</Button>
      </div>

      <Table dataSource={trashData} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default MovieTrash;