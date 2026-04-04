// // src/app/Admin/pages/Seat/SeatManager.tsx
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Button, InputNumber, Form, Card, message,
//   Popconfirm, Spin, Tag, Tooltip, Select
// } from 'antd';
// import {
//   ArrowLeftOutlined, SaveOutlined, DeleteOutlined,
//   AppstoreAddOutlined, InfoCircleOutlined
// } from '@ant-design/icons';
// import Selecto from 'react-selecto';
// import { getSeatsByRoom, bulkCreateSeats, deleteAllSeats } from '../../../../common/api/adminAPI';

// // ── Types ────────────────────────────────────────────────────────────
// type SeatType = 'NORMAL' | 'VIP' | 'COUPLE';

// interface Seat {
//   id?: number;
//   seat_row: string;       // 'A', 'B', ...
//   seat_number: number;    // 1, 2, 3, ...
//   seat_type: SeatType;
//   room_id: number;
//   // dùng khi render client-side trước khi save
//   _colIndex?: number;
// }

// // ── Helpers ───────────────────────────────────────────────────────────
// const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// const SEAT_TYPE_CONFIG: Record<SeatType, { label: string; color: string; bg: string; border: string }> = {
//   NORMAL: { label: 'Thường',  color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
//   VIP:    { label: 'VIP',     color: '#b45309', bg: '#fef3c7', border: '#f59e0b' },
//   COUPLE: { label: 'Couple',  color: '#7c3aed', bg: '#ede9fe', border: '#8b5cf6' },
// };

// // Generate seat grid: mỗi ô = 1 ghế, COUPLE đánh dấu theo cặp chẵn-lẻ cột
// const generateSeats = (rows: number, cols: number, roomId: number): Seat[] => {
//   const seats: Seat[] = [];
//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       seats.push({
//         seat_row: ROW_LABELS[r],
//         seat_number: c + 1,
//         seat_type: 'NORMAL',
//         room_id: roomId,
//         _colIndex: c,
//       });
//     }
//   }
//   return seats;
// };

// // Tạo key duy nhất cho ghế
// const seatKey = (s: Seat) => `${s.seat_row}-${s.seat_number}`;

// // ── Component ─────────────────────────────────────────────────────────
// const SeatManager = () => {
//   const { roomId } = useParams<{ roomId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { roomName, cinemaName } = (location.state as { roomName?: string; cinemaName?: string }) || {};
//   const [form] = Form.useForm();

//   const [seats, setSeats] = useState<Seat[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [hasExisting, setHasExisting] = useState(false);

//   // Tool đang chọn để paint
//   const [paintType, setPaintType] = useState<SeatType>('VIP');

//   // Ref container để Selecto biết vùng scroll
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   // ── Fetch existing seats ─────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     if (!roomId) return;
//     setLoading(true);
//     try {
//       const seatRes = await getSeatsByRoom(Number(roomId));
//       const existingSeats: Seat[] = seatRes.data.data || [];
//       if (existingSeats.length > 0) {
//         const withIndex = existingSeats.map(s => ({
//           ...s,
//           _colIndex: s.seat_number - 1,
//           seat_type: (s.seat_type as string).toUpperCase() as SeatType,
//         }));
//         setSeats(withIndex);
//         setHasExisting(true);
//       }
//     } catch {
//       message.error('Không thể tải danh sách ghế');
//     } finally {
//       setLoading(false);
//     }
//   }, [roomId]);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // ── Generate ghế từ form ──────────────────────────────────────────
//   const handleGenerate = (values: { rows: number; cols: number }) => {
//     if (!roomId) return;
//     const generated = generateSeats(values.rows, values.cols, Number(roomId));
//     setSeats(generated);
//     setHasExisting(false);
//     message.success(`Đã tạo sơ đồ ${values.rows} hàng × ${values.cols} cột. Hãy chọn loại ghế rồi lưu.`);
//   };

//   // ── Áp dụng loại ghế cho một tập key ghế ─────────────────────────
//   const applyTypeToKeys = useCallback((keys: Set<string>, type: SeatType) => {
//     setSeats(prev => prev.map(s => {
//       if (!keys.has(seatKey(s))) return s;

//       if (type === 'COUPLE') {
//         // Với COUPLE, cũng kéo ghế partner (cặp chẵn-lẻ cùng hàng)
//         // Ta xử lý ở bước dưới — ở đây cứ đánh dấu ghế được chọn trước
//         return { ...s, seat_type: type };
//       }
//       return { ...s, seat_type: type };
//     }));

//     // Nếu là COUPLE, bổ sung partner chưa được chọn
//     if (type === 'COUPLE') {
//       setSeats(prev => {
//         const partnerKeys = new Set<string>();
//         prev.forEach(s => {
//           if (keys.has(seatKey(s))) {
//             const partnerCol = s._colIndex! % 2 === 0
//               ? s._colIndex! + 1
//               : s._colIndex! - 1;
//             // Tìm partner trong cùng hàng
//             const partner = prev.find(
//               p => p.seat_row === s.seat_row && p._colIndex === partnerCol
//             );
//             if (partner) partnerKeys.add(seatKey(partner));
//           }
//         });
//         return prev.map(s =>
//           partnerKeys.has(seatKey(s)) ? { ...s, seat_type: type } : s
//         );
//       });
//     }
//   }, []);

//   // ── Click đơn ghế để đổi loại ─────────────────────────────────────
//   const handleSeatClick = (clickedSeat: Seat) => {
//     applyTypeToKeys(new Set([seatKey(clickedSeat)]), paintType);
//   };

//   // ── Selecto: kéo vùng chọn xong → áp type ────────────────────────
//   const handleSelectEnd = useCallback((e: any) => {
//     const selected: Element[] = e.selected;
//     if (selected.length === 0) return;

//     const keys = new Set(
//       selected.map(el => el.getAttribute('data-seat-key') ?? '').filter(Boolean)
//     );
//     applyTypeToKeys(keys, paintType);

//     // Xóa class highlight sau khi áp dụng
//     selected.forEach(el => el.classList.remove('selecto-selected'));
//   }, [paintType, applyTypeToKeys]);

//   // ── Save lên backend ──────────────────────────────────────────────
//   const handleSave = async () => {
//     if (seats.length === 0) { message.warning('Chưa có ghế nào để lưu'); return; }
//     setSaving(true);
//     try {
//       // Bỏ _colIndex trước khi gửi
//       const payload = seats.map(({ _colIndex, ...s }) => s);
//       await bulkCreateSeats(Number(roomId), payload);
//       message.success('Đã lưu sơ đồ ghế thành công!');
//       setHasExisting(true);
//       fetchData();
//     } catch (err: any) {
//       message.error('Lỗi khi lưu: ' + (err.response?.data?.message || 'Không xác định'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Xóa toàn bộ ghế ──────────────────────────────────────────────
//   const handleDeleteAll = async () => {
//     try {
//       await deleteAllSeats(Number(roomId));
//       setSeats([]);
//       setHasExisting(false);
//       message.success('Đã xóa toàn bộ ghế');
//     } catch {
//       message.error('Lỗi khi xóa ghế');
//     }
//   };

//   // ── Group seats by row ────────────────────────────────────────────
//   const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, s) => {
//     if (!acc[s.seat_row]) acc[s.seat_row] = [];
//     acc[s.seat_row].push(s);
//     return acc;
//   }, {});
//   const sortedRows = Object.keys(seatsByRow).sort();

//   // ── Stats ─────────────────────────────────────────────────────────
//   const stats = seats.reduce<Record<SeatType, number>>(
//     (acc, s) => { acc[s.seat_type]++; return acc; },
//     { NORMAL: 0, VIP: 0, COUPLE: 0 }
//   );

//   // ── Render ────────────────────────────────────────────────────────
//   if (loading) return (
//     <div className="flex justify-center items-center h-64">
//       <Spin size="large" tip="Đang tải sơ đồ ghế..." />
//     </div>
//   );

//   return (
//     <div className="p-4 max-w-6xl mx-auto">

//       {/* ── Header ── */}
//       <div className="flex items-center gap-3 mb-6">
//         <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/cinemas')}>
//           Quay lại
//         </Button>
//         <div>
//           <h2 className="text-2xl font-bold mb-0">Sơ đồ ghế ngồi</h2>
//           {(cinemaName || roomName) && (
//             <p className="text-gray-500 text-sm mt-0.5">
//               {cinemaName} —{' '}
//               <span className="font-semibold text-blue-600">{roomName}</span>
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

//         {/* ── LEFT: Controls ── */}
//         <div className="lg:col-span-1 space-y-4">

//           {/* Generate form — chỉ hiện khi chưa có ghế */}
//           {!hasExisting && (
//             <Card title={<span><AppstoreAddOutlined className="mr-2" />Tạo sơ đồ mới</span>} size="small">
//               <Form form={form} layout="vertical" onFinish={handleGenerate}>
//                 <Form.Item
//                   name="rows"
//                   label="Số hàng (A, B, C...)"
//                   rules={[{ required: true }]}
//                   initialValue={8}
//                 >
//                   <InputNumber min={1} max={26} className="w-full" />
//                 </Form.Item>
//                 <Form.Item
//                   name="cols"
//                   label="Số ghế mỗi hàng"
//                   rules={[{ required: true }]}
//                   initialValue={10}
//                 >
//                   <InputNumber min={2} max={30} step={2} className="w-full" />
//                 </Form.Item>
//                 <Button type="primary" htmlType="submit" block icon={<AppstoreAddOutlined />}>
//                   Tạo sơ đồ
//                 </Button>
//               </Form>
//             </Card>
//           )}

//           {/* Paint tool */}
//           {seats.length > 0 && (
//             <Card title="Công cụ chỉnh ghế" size="small">
//               <p className="text-xs text-gray-500 mb-3">
//                 <InfoCircleOutlined className="mr-1" />
//                 Click hoặc <strong>kéo vùng chọn</strong> để đổi loại ghế.
//               </p>
//               <div className="space-y-2">
//                 {(['NORMAL', 'VIP', 'COUPLE'] as SeatType[]).map(type => (
//                   <button
//                     key={type}
//                     onClick={() => setPaintType(type)}
//                     className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left ${
//                       paintType === type
//                         ? 'border-blue-500 bg-blue-50 shadow-sm'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <span
//                       className="w-5 h-5 rounded flex-shrink-0 border-2"
//                       style={{
//                         background: SEAT_TYPE_CONFIG[type].bg,
//                         borderColor: SEAT_TYPE_CONFIG[type].border,
//                       }}
//                     />
//                     <span className="text-sm font-medium">{SEAT_TYPE_CONFIG[type].label}</span>
//                     {type === 'COUPLE' && (
//                       <span className="text-xs text-purple-500 ml-auto">×2 ô</span>
//                     )}
//                     {paintType === type && (
//                       <span className="text-xs text-blue-600 ml-auto font-bold">✓ Đang dùng</span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* Stats */}
//           {seats.length > 0 && (
//             <Card title="Thống kê" size="small">
//               <div className="space-y-2">
//                 {(['NORMAL', 'VIP', 'COUPLE'] as SeatType[]).map(type => (
//                   <div key={type} className="flex justify-between items-center">
//                     <Tag
//                       color={type === 'NORMAL' ? 'default' : type === 'VIP' ? 'gold' : 'purple'}
//                     >
//                       {SEAT_TYPE_CONFIG[type].label}
//                     </Tag>
//                     <span className="font-bold">{stats[type]} ghế</span>
//                   </div>
//                 ))}
//                 <div className="border-t pt-2 flex justify-between font-bold">
//                   <span>Tổng cộng</span>
//                   <span>{seats.length} ghế</span>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {/* Action buttons */}
//           {seats.length > 0 && (
//             <div className="space-y-2">
//               <Button
//                 type="primary"
//                 icon={<SaveOutlined />}
//                 onClick={handleSave}
//                 loading={saving}
//                 block
//                 size="large"
//               >
//                 Lưu sơ đồ ghế
//               </Button>
//               <Popconfirm
//                 title="Xóa toàn bộ ghế?"
//                 description="Hành động này không thể hoàn tác!"
//                 onConfirm={handleDeleteAll}
//                 okText="Xóa hết"
//                 cancelText="Hủy"
//                 okButtonProps={{ danger: true }}
//               >
//                 <Button danger icon={<DeleteOutlined />} block>
//                   Xóa & làm lại
//                 </Button>
//               </Popconfirm>
//             </div>
//           )}
//         </div>

//         {/* ── RIGHT: Seat Map ── */}
//         <div className="lg:col-span-3">
//           {seats.length === 0 ? (
//             <Card>
//               <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//                 <AppstoreAddOutlined style={{ fontSize: 48 }} className="mb-4" />
//                 <p className="text-lg font-medium">Phòng này chưa có sơ đồ ghế</p>
//                 <p className="text-sm">Nhập số hàng và số cột ở bên trái để tạo</p>
//               </div>
//             </Card>
//           ) : (
//             <Card
//               title="Sơ đồ ghế — click hoặc kéo vùng để đổi loại"
//               extra={<span className="text-xs text-gray-400">🖥️ Màn hình chiếu</span>}
//             >
//               {/* Màn hình */}
//               <div className="flex justify-center mb-6">
//                 <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60" />
//               </div>
//               <div className="text-center text-xs text-gray-400 mb-6 tracking-widest uppercase">
//                 — Màn hình —
//               </div>

//               {/* Seat grid + Selecto */}
//               <div className="overflow-x-auto" ref={scrollContainerRef}>
//                 {/* Selecto: kéo vùng trên container này */}
//                 <Selecto
//                   container={scrollContainerRef.current}
//                   selectableTargets={['button[data-seat-key]']}
//                   selectByClick={false}
//                   selectFromInside={true}
//                   continueSelect={false}
//                   hitRate={0}
//                   ratio={0}
//                   onSelect={(e) => {
//                     // Highlight realtime khi đang kéo
//                     e.added.forEach(el => el.classList.add('selecto-selected'));
//                     e.removed.forEach(el => el.classList.remove('selecto-selected'));
//                   }}
//                   onSelectEnd={handleSelectEnd}
//                 />

//                 <div className="flex flex-col items-center">
//                   {sortedRows.map(row => {
//                     const rowSeats = seatsByRow[row].sort((a, b) => a.seat_number - b.seat_number);
//                     return (
//                       <div key={row} className="flex items-center justify-center gap-1 mb-1.5">
//                         {/* Row label */}
//                         <span className="w-6 text-center text-xs font-bold text-gray-500 flex-shrink-0">
//                           {row}
//                         </span>

//                         {/* Seats */}
//                         <div className="flex gap-1 flex-wrap">
//                           {rowSeats.map((seat, idx) => {
//                             const cfg = SEAT_TYPE_CONFIG[seat.seat_type];
//                             const isCouple = seat.seat_type === 'COUPLE';
//                             const isFirstOfPair = isCouple && seat._colIndex! % 2 === 0;
//                             const isSecondOfPair = isCouple && seat._colIndex! % 2 === 1;

//                             return (
//                               <React.Fragment key={`${seat.seat_row}-${seat.seat_number}`}>
//                                 {/* Khoảng cách giữa các cặp couple */}
//                                 {isCouple && isFirstOfPair && idx > 0 && (
//                                   <div className="w-1" />
//                                 )}
//                                 <Tooltip
//                                   title={`${seat.seat_row}${seat.seat_number} — ${cfg.label}`}
//                                   mouseEnterDelay={0.5}
//                                 >
//                                   <button
//                                     data-seat-key={seatKey(seat)}
//                                     onClick={() => handleSeatClick(seat)}
//                                     className="w-7 h-7 rounded text-xs font-bold border-2 transition-all duration-100 hover:scale-110 hover:shadow-md flex items-center justify-center cursor-pointer selecto-seat"
//                                     style={{
//                                       background: cfg.bg,
//                                       borderColor: cfg.border,
//                                       color: cfg.color,
//                                       borderRadius: isCouple
//                                         ? (isFirstOfPair ? '6px 2px 2px 6px' : '2px 6px 6px 2px')
//                                         : '6px',
//                                     }}
//                                   >
//                                     {seat.seat_number}
//                                   </button>
//                                 </Tooltip>
//                               </React.Fragment>
//                             );
//                           })}
//                         </div>

//                         {/* Seat count per row */}
//                         <span className="ml-2 text-xs text-gray-400 flex-shrink-0">
//                           {rowSeats.length} ghế
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Legend */}
//               <div className="flex gap-4 mt-6 pt-4 border-t justify-center flex-wrap">
//                 {(['NORMAL', 'VIP', 'COUPLE'] as SeatType[]).map(type => {
//                   const cfg = SEAT_TYPE_CONFIG[type];
//                   return (
//                     <div key={type} className="flex items-center gap-1.5">
//                       <span
//                         className="w-5 h-5 rounded border-2 inline-block"
//                         style={{ background: cfg.bg, borderColor: cfg.border }}
//                       />
//                       <span className="text-xs text-gray-600">{cfg.label}</span>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Selecto highlight style */}
//               <style>{`
//                 .selecto-selected {
//                   outline: 2px solid #3b82f6 !important;
//                   outline-offset: 1px;
//                   transform: scale(1.12) !important;
//                   z-index: 10;
//                   position: relative;
//                 }
//                 .selecto-area {
//                   background: rgba(59, 130, 246, 0.1) !important;
//                   border: 1px solid rgba(59, 130, 246, 0.6) !important;
//                 }
//               `}</style>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatManager;
// src/app/Admin/pages/Seat/SeatManager.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Spin } from 'antd';
import { ArrowLeftOutlined, AppstoreAddOutlined } from '@ant-design/icons';

import type { SeatType } from './type';
import { useSeatManager } from './useSeatManager';
import GenerateForm    from './components/GenerateForm';
import PaintToolbar    from './components/PaintToolbar';
import SeatStats       from './components/SeatStats';
import ActionButtons   from './components/Actionbuttons';
import SeatGrid        from './components/SeatGrid';

const SeatManager = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { roomName, cinemaName } =
    (location.state as { roomName?: string; cinemaName?: string }) || {};

  const [paintType, setPaintType] = useState<SeatType>('VIP');

  const {
    seats,
    loading,
    saving,
    hasExisting,
    handleGenerate,
    applyType,
    handleSeatClick,
    handleSave,
    handleDeleteAll,
  } = useSeatManager(roomId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải sơ đồ ghế..." />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/cinemas')}>
          Quay lại
        </Button>
        <div>
          <h2 className="text-2xl font-bold mb-0">Sơ đồ ghế ngồi</h2>
          {(cinemaName || roomName) && (
            <p className="text-gray-500 text-sm mt-0.5">
              {cinemaName} —{' '}
              <span className="font-semibold text-blue-600">{roomName}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── LEFT: Controls ── */}
        <div className="lg:col-span-1 space-y-4">
          {!hasExisting && (
            <GenerateForm onFinish={handleGenerate} />
          )}

          {seats.length > 0 && (
            <PaintToolbar paintType={paintType} onChange={setPaintType} />
          )}

          {seats.length > 0 && (
            <SeatStats seats={seats} />
          )}

          {seats.length > 0 && (
            <ActionButtons
              saving={saving}
              onSave={handleSave}
              onDeleteAll={handleDeleteAll}
            />
          )}
        </div>

        {/* ── RIGHT: Seat Map ── */}
        <div className="lg:col-span-3">
          {seats.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <AppstoreAddOutlined style={{ fontSize: 48 }} className="mb-4" />
                <p className="text-lg font-medium">Phòng này chưa có sơ đồ ghế</p>
                <p className="text-sm">Nhập số hàng và số cột ở bên trái để tạo</p>
              </div>
            </Card>
          ) : (
            <Card
              title="Sơ đồ ghế — click hoặc kéo vùng để đổi loại"
              extra={<span className="text-xs text-gray-400">🖥️ Màn hình chiếu</span>}
            >
              <SeatGrid
                seats={seats}
                onSeatClick={seat => handleSeatClick(seat, paintType)}
                onSelectEnd={keys => applyType(keys, paintType)}
              />
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default SeatManager;