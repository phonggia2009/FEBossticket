// src/app/Admin/pages/Movie/components/MovieTable.tsx

import React from 'react';
import { Table, Button, Space, Popconfirm, Image, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Movie } from '../type';

interface Props {
  dataSource: Movie[];
  loading: boolean;
  // Cho phép pagination có thể undefined để không bị lỗi lúc chưa load xong
  pagination?: { current: number; pageSize: number; total: number }; 
  onPageChange?: (page: number) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const MovieTable: React.FC<Props> = ({ dataSource, loading, pagination, onPageChange, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Poster',
      dataIndex: 'posterUrl',
      render: (url: string) => <Image src={url} width={50} fallback="https://via.placeholder.com/50x75" />,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Ngày phát hành', dataIndex: 'releaseDate', key: 'releaseDate' },
    {
       title: 'Thể loại',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres: any[]) => (
        <div className="flex flex-wrap gap-1">
          {genres && genres.length > 0 ? (
            genres.map((g: any) => (
              <Tag color="blue" key={g.id}>
                {g.name}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: Movie) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa phim này?" onConfirm={() => onDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Table 
      dataSource={dataSource || []} // An toàn: Nếu dataSource là undefined thì dùng mảng rỗng
      columns={columns} 
      rowKey="id" 
      loading={loading} 
      // An toàn: Chỉ render pagination nếu object pagination tồn tại
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: (page) => onPageChange && onPageChange(page),
        showSizeChanger: false,
        position: ['bottomCenter']
      } : false} 
    />
  );
};

export default MovieTable;