// src/app/Admin/pages/Cinema/useCinemaManager.ts

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { 
  getAllCinemas, deleteCinema, searchCinemas, 
  getRoomsByCinema, deleteRoom 
} from '../../../../common/api/adminAPI';
import type { Cinema } from './type';
import type { Room } from '../Room/type';

export const useCinemaManager = () => {
  // Cinema State
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);

  // Room Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomLoading, setRoomLoading] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const res = await getAllCinemas();
      setCinemas(res.data.data.cinemas);
    } catch {
      message.error('Không thể lấy danh sách rạp');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) { fetchCinemas(); return; }
    setLoading(true);
    try {
      const res = await searchCinemas(value);
      setCinemas(res.data.data.cinemas);
    } catch {
      message.error('Lỗi khi tìm kiếm rạp');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCinema = async (id: number) => {
    try {
      await deleteCinema(id);
      message.success('Đã xóa rạp');
      fetchCinemas();
    } catch {
      message.error('Lỗi khi xóa rạp');
    }
  };

  // Logic Phòng chiếu trong Drawer
  const fetchRooms = useCallback(async (cinemaId: number) => {
    setRoomLoading(true);
    try {
      const res = await getRoomsByCinema(cinemaId);
      
      // Bóc tách dữ liệu an toàn đảm bảo luôn là Array
      const dataFromApi = res.data?.data?.rooms || res.data?.data || res.data?.rooms;
      const roomsArray = Array.isArray(dataFromApi) ? dataFromApi : [];
      
      setRooms(roomsArray);
    } catch {
      message.error('Lỗi tải danh sách phòng');
    } finally {
      setRoomLoading(false);
    }
  }, []);
  
  const openRoomDrawer = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    setDrawerOpen(true);
    fetchRooms(cinema.id);
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      await deleteRoom(roomId);
      message.success('Đã xóa phòng');
      if (selectedCinema) fetchRooms(selectedCinema.id);
    } catch {
      message.error('Lỗi khi xóa phòng');
    }
  };

  useEffect(() => { fetchCinemas(); }, []);

  return {
    cinemas, loading, isModalOpen, setIsModalOpen, editingCinema, setEditingCinema,
    drawerOpen, setDrawerOpen, selectedCinema, setSelectedCinema,
    rooms, roomLoading, isRoomModalOpen, setIsRoomModalOpen, editingRoom, setEditingRoom,
    fetchCinemas, handleSearch, handleDeleteCinema,
    fetchRooms, openRoomDrawer, handleDeleteRoom
  };
};