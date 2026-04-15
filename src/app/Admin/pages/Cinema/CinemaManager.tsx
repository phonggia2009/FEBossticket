// src/app/Admin/pages/Cinema/CinemaManager.tsx

import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchBox from '../../../../common/components/SearchBox';
import RoomForm from '../Room/components/RoomForm';
import { useCinemaManager } from './useCinemaManager';
import CinemaTable from './components/CinemaTable';
import CinemaForm from './components/CinemaForm';
import RoomDrawer from './components/RoomDrawer';

const CinemaManager = () => {
  const {
    cinemas, loading, isModalOpen, setIsModalOpen, editingCinema, setEditingCinema,
    drawerOpen, setDrawerOpen, selectedCinema, setSelectedCinema,
    rooms, roomLoading, isRoomModalOpen, setIsRoomModalOpen, editingRoom, setEditingRoom,
    fetchCinemas, handleSearch, handleDeleteCinema,
    fetchRooms, openRoomDrawer, handleDeleteRoom
  } = useCinemaManager();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Rạp Chiếu Phim</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => { setEditingCinema(null); setIsModalOpen(true); }}
        >
          Thêm rạp mới
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-600">Tìm rạp:</span>
          <SearchBox placeholder="Nhập tên rạp hoặc thành phố..." onSearch={handleSearch} loading={loading} />
        </div>
      </Card>

      <CinemaTable 
        dataSource={cinemas} 
        loading={loading} 
        onEdit={(record) => { setEditingCinema(record); setIsModalOpen(true); }}
        onDelete={handleDeleteCinema}
        onOpenRooms={openRoomDrawer}
      />

      <CinemaForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); fetchCinemas(); }}
        editingCinema={editingCinema}
      />

      <RoomDrawer 
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedCinema(null); fetchCinemas(); }}
        selectedCinema={selectedCinema}
        rooms={rooms}
        loading={roomLoading}
        onAddRoom={() => { setEditingRoom(null); setIsRoomModalOpen(true); }}
        onEditRoom={(room) => { setEditingRoom(room); setIsRoomModalOpen(true); }}
        onDeleteRoom={handleDeleteRoom}
      />

      <RoomForm
        open={isRoomModalOpen}
        onCancel={() => setIsRoomModalOpen(false)}
        onSuccess={() => { setIsRoomModalOpen(false); if (selectedCinema) fetchRooms(selectedCinema.id); }}
        editingRoom={editingRoom}
        cinemas={cinemas}
        selectedCinemaId={selectedCinema?.id ?? null}
      />
    </div>
  );
};

export default CinemaManager;