// src/app/Admin/pages/Room/useRoomManager.ts

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getRoomsByCinema, deleteRoom, getAllCinemas } from '../../../../common/api/adminAPI';
import type { Room, Cinema } from './type';

export const useRoomManager = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const fetchCinemas = async () => {
    try {
      const res = await getAllCinemas();
      setCinemas(res.data.data.cinemas);
    } catch (err) {
      message.error('Không thể tải danh sách rạp');
    }
  };

  const fetchRooms = useCallback(async (cinemaId: number) => {
    setLoading(true);
    try {
      const res = await getRoomsByCinema(cinemaId);
      
      // Bóc tách dữ liệu an toàn
      const dataFromApi = res.data?.data?.rooms || res.data?.data || res.data?.rooms;
      const roomsArray = Array.isArray(dataFromApi) ? dataFromApi : [];
      
      setRooms(roomsArray); 
    } catch (err) {
      message.error('Lỗi tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCinemas();
  }, []);

  useEffect(() => {
    if (selectedCinemaId) {
      fetchRooms(selectedCinemaId);
    } else {
      setRooms([]);
    }
  }, [selectedCinemaId, fetchRooms]);

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      message.success('Xóa phòng thành công');
      if (selectedCinemaId) fetchRooms(selectedCinemaId);
    } catch (err) {
      message.error('Lỗi khi xóa phòng');
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  return {
    rooms,
    cinemas,
    loading,
    selectedCinemaId,
    setSelectedCinemaId,
    isModalOpen,
    setIsModalOpen,
    editingRoom,
    fetchRooms,
    handleDelete,
    openAddModal,
    openEditModal,
  };
};