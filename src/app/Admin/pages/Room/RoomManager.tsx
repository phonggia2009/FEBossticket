import React from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRoomManager } from './useRoomManager';
import RoomTable from './components/RoomTable';
import RoomForm from './components/RoomForm';
import CinemaSelector from './components/CinemaSelector';

const RoomManager = () => {
  const {
    rooms, cinemas, loading, selectedCinemaId, setSelectedCinemaId,
    isModalOpen, setIsModalOpen, editingRoom,
    fetchRooms, handleDelete, openAddModal, openEditModal
  } = useRoomManager();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Phòng Chiếu</h2>
        <Button 
          type="primary" 
          disabled={!selectedCinemaId} 
          icon={<PlusOutlined />} 
          onClick={openAddModal}
        >
          Thêm phòng mới
        </Button>
      </div>

      <CinemaSelector 
        cinemas={cinemas} 
        selectedCinemaId={selectedCinemaId} 
        onChange={setSelectedCinemaId} 
      />

      {selectedCinemaId ? (
        <RoomTable 
          rooms={rooms} 
          loading={loading} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      ) : (
        <Empty description="Hãy chọn một rạp để quản lý các phòng chiếu trực thuộc" />
      )}

      <RoomForm 
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          if (selectedCinemaId) fetchRooms(selectedCinemaId);
        }}
        editingRoom={editingRoom}
        cinemas={cinemas}
        selectedCinemaId={selectedCinemaId} 
      />
    </div>
  );
};

export default RoomManager;