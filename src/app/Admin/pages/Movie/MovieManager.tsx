// src/app/Admin/pages/Movie/MovieManager.tsx

import { Button, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../../../../common/components/SearchBox';
import MovieForm from './components/MovieForm';
import MovieTable from './components/MovieTable';
import { useMovieManager } from './useMovieManager';

const MovieManager = () => {
  const navigate = useNavigate();
  const {
    movies, genres, loading, searching, isModalOpen, setIsModalOpen, editingMovie, setEditingMovie,
    fetchData, handleSearch, handleDelete, pagination, handlePageChange
  } = useMovieManager();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quản lý Phim</h2>
        <Space>
          <Button danger icon={<DeleteOutlined />} onClick={() => navigate('/admin/movies/trash')}>
            Thùng rác
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingMovie(null); setIsModalOpen(true); }}>
            Thêm phim mới
          </Button>
        </Space>
      </div>

      <SearchBox placeholder="Tìm tên phim..." onSearch={handleSearch} loading={searching} />
      
      <MovieTable 
        dataSource={movies} 
        loading={loading} 
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={(m) => { setEditingMovie(m); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <MovieForm 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onSuccess={() => { setIsModalOpen(false); fetchData(pagination.current); }}
        editingMovie={editingMovie}
        genres={genres}
      />
    </div>
  );
};

export default MovieManager;