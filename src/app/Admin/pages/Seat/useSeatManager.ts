// src/app/Admin/pages/Seat/useSeatManager.ts

import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { Seat, SeatType } from './type';
import { seatKey, generateSeats, applyTypeToSeats } from './utils';
import { getSeatsByRoom, bulkCreateSeats, deleteAllSeats } from '../../../../common/api/adminAPI';

export const useSeatManager = (roomId: string | undefined) => {
  const [seats, setSeats]           = useState<Seat[]>([]);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const res = await getSeatsByRoom(Number(roomId));
      const existing: Seat[] = res.data.data || [];
      if (existing.length > 0) {
        setSeats(
          existing.map(s => ({
            ...s,
            _colIndex: s.seat_number - 1,
            seat_type: (s.seat_type as string).toUpperCase() as SeatType,
          })),
        );
        setHasExisting(true);
      }
    } catch {
      message.error('Không thể tải danh sách ghế');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Generate ──────────────────────────────────────────────────────
  const handleGenerate = useCallback(
    (values: { rows: number; cols: number }) => {
      if (!roomId) return;
      setSeats(generateSeats(values.rows, values.cols, Number(roomId)));
      setHasExisting(false);
      message.success(
        `Đã tạo sơ đồ ${values.rows} hàng × ${values.cols} cột. Hãy chọn loại ghế rồi lưu.`,
      );
    },
    [roomId],
  );

  // ── Apply type to a set of seat keys ─────────────────────────────
  const applyType = useCallback((keys: Set<string>, type: SeatType) => {
    setSeats(prev => applyTypeToSeats(prev, keys, type));
  }, []);

  // ── Click single seat ─────────────────────────────────────────────
  const handleSeatClick = useCallback(
    (seat: Seat, paintType: SeatType) => {
      applyType(new Set([seatKey(seat)]), paintType);
    },
    [applyType],
  );

  // ── Save ──────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (seats.length === 0) { message.warning('Chưa có ghế nào để lưu'); return; }
    setSaving(true);
    try {
      const payload = seats.map(({ _colIndex, ...s }) => s);
      await bulkCreateSeats(Number(roomId), payload);
      message.success('Đã lưu sơ đồ ghế thành công!');
      setHasExisting(true);
      fetchData();
    } catch (err: any) {
      message.error('Lỗi khi lưu: ' + (err.response?.data?.message || 'Không xác định'));
    } finally {
      setSaving(false);
    }
  }, [seats, roomId, fetchData]);

  // ── Delete all ────────────────────────────────────────────────────
  const handleDeleteAll = useCallback(async () => {
    try {
      await deleteAllSeats(Number(roomId));
      setSeats([]);
      setHasExisting(false);
      message.success('Đã xóa toàn bộ ghế');
    } catch {
      message.error('Lỗi khi xóa ghế');
    }
  }, [roomId]);

  return {
    seats,
    loading,
    saving,
    hasExisting,
    fetchData,
    handleGenerate,
    applyType,
    handleSeatClick,
    handleSave,
    handleDeleteAll,
  };
};