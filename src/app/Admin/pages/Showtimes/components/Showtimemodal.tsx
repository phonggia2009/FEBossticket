// src/app/Admin/pages/Showtimes/components/Showtimemodal.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal, Form, Select, DatePicker, InputNumber,
  Alert, Spin, Row, Col, Typography, Input, Divider, Space
} from 'antd';
import { ExclamationCircleOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // Import plugin so sánh ngày
import type { Showtime, ShowtimeFormValues, Movie, Cinema, Room, SeatTypeName } from '../type';
import { MIN_PRICE, MAX_PRICE, PRICE_STEP, DATETIME_FORMAT } from '../constants';
import { disablePastDate, buildConflictMessage, formatVND } from '../utils';

// Kích hoạt plugin của dayjs
dayjs.extend(isSameOrBefore);

// Import các hàm API
import {
  getRoomsByCinema,
  checkShowtimeConflict,
} from '../../../../../common/api/adminAPI';

const { Text } = Typography;

const SEAT_TYPES: { label: string; value: SeatTypeName }[] = [
  { label: 'Ghế thường (NORMAL)', value: 'NORMAL' },
  { label: 'Ghế VIP', value: 'VIP' },
  { label: 'Ghế đôi (SWEETBOX)', value: 'COUPLE' },
];

interface Props {
  open:               boolean;
  editTarget:         Showtime | null;
  movies:             Movie[];
  cinemas:            Cinema[];
  submitting:         boolean;
  onSubmit:           (values: ShowtimeFormValues) => void;
  onCancel:           () => void;
}

const ShowtimeModal: React.FC<Props> = ({
  open,
  editTarget,
  movies,
  cinemas,
  submitting,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<ShowtimeFormValues>();

  const [rooms,             setRooms]             = useState<Room[]>([]);
  const [roomLoading,       setRoomLoading]       = useState(false);
  const [conflictMsg,       setConflictMsg]       = useState<string | null>(null);
  const [conflictChecking,  setConflictChecking]  = useState(false);

  // 1. THEO DÕI SỰ KIỆN CHỌN PHIM VÀ CHỌN NGÀY THEO THỜI GIAN THỰC
  const selectedStartTime = Form.useWatch('start_time', form);
  const selectedMovieId = Form.useWatch('movie_id', form);

  // 2. LOGIC LỌC PHIM: Chỉ hiện phim có Ngày khởi chiếu <= Ngày chiếu đã chọn
  const validMovies = React.useMemo(() => {
    if (!selectedStartTime) return movies; // Chưa chọn ngày thì hiện tất cả
    
    const showDate = dayjs(selectedStartTime).startOf('day').valueOf();
    
    return movies.filter(m => {
      // (Dùng as any đề phòng file type.ts của bạn chưa định nghĩa releaseDate)
      const releaseStr = (m as any).releaseDate; 
      if (!releaseStr) return true; // Phim không có ngày khởi chiếu mặc định cho qua
      
      const releaseDate = dayjs(releaseStr).startOf('day').valueOf();
      return releaseDate <= showDate;
    });
  }, [movies, selectedStartTime]);

  // 3. LOGIC LỌC NGÀY: Khóa các ngày trong quá khứ VÀ trước ngày khởi chiếu của phim đã chọn
  const customDisableDate = (current: dayjs.Dayjs) => {
    // Luôn khóa ngày trong quá khứ (Dùng hàm cũ của bạn)
    if (disablePastDate(current)) return true;

    // Nếu đã chọn phim, khóa tiếp các ngày diễn ra trước ngày khởi chiếu
    if (selectedMovieId) {
      const selectedMovie = movies.find(m => m.id === selectedMovieId);
      const releaseStr = (selectedMovie as any)?.releaseDate;
      if (releaseStr) {
        const releaseDate = dayjs(releaseStr).startOf('day');
        // Khóa nếu current nhỏ hơn releaseDate
        if (current.isBefore(releaseDate, 'day')) {
          return true;
        }
      }
    }
    return false;
  };

  // ─── Đổ dữ liệu vào Form khi mở Modal ──────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    if (editTarget) {
      const cinemaId = editTarget.room?.cinema?.id;
      const seatPrices = SEAT_TYPES.map(type => {
        const found = editTarget.seat_prices?.find(sp => sp.seat_type === type.value);
        return {
          seat_type: type.value,
          price: found ? found.price : undefined
        };
      });

      form.setFieldsValue({
        movie_id:   editTarget.movie_id,
        cinema_id:  cinemaId,
        room_id:    editTarget.room_id,
        start_time: dayjs(editTarget.start_time) as any,
        seat_prices: seatPrices,
      });
      
      if (cinemaId) loadRooms(cinemaId);
    } else {
      form.resetFields();
      form.setFieldsValue({
        seat_prices: SEAT_TYPES.map(t => ({ seat_type: t.value, price: 50000 }))
      });
      setRooms([]);
    }

    setConflictMsg(null);
  }, [open, editTarget, form]);

  // ─── Load danh sách phòng theo Rạp ──────────────────────────────────────
  const loadRooms = async (cinemaId: number) => {
    setRoomLoading(true);
    try {
      const res = await getRoomsByCinema(cinemaId);
      const dataFromApi = res.data?.data?.rooms || res.data?.data || res.data?.rooms;
      setRooms(Array.isArray(dataFromApi) ? dataFromApi : []);
    } catch (error) {
      setRooms([]);
    } finally {
      setRoomLoading(false);
    }
  };

  const handleCinemaChange = (cinemaId: number) => {
    form.setFieldValue('room_id', undefined);
    setRooms([]);
    setConflictMsg(null);
    loadRooms(cinemaId);
  };

  // ─── Kiểm tra xung đột lịch chiếu ───────────────────────────────────────
  const runConflictCheck = useCallback(async () => {
    const { movie_id, room_id, start_time } = form.getFieldsValue([
      'movie_id', 'room_id', 'start_time',
    ]);

    if (!movie_id || !room_id || !start_time) {
      setConflictMsg(null);
      return;
    }

    setConflictChecking(true);
    try {
      const res  = await checkShowtimeConflict({
        movie_id,
        room_id,
        start_time:  dayjs(start_time).toISOString(),
        exclude_id:  editTarget?.id,
      });

      const body = res.data?.data ?? res.data;
      setConflictMsg(
        body?.hasConflict && body?.conflict
          ? buildConflictMessage(body.conflict)
          : null
      );
    } catch {
      setConflictMsg(null);
    } finally {
      setConflictChecking(false);
    }
  }, [editTarget, form]);

  const handleValuesChange = (changed: Partial<ShowtimeFormValues>) => {
    if ('movie_id' in changed || 'room_id' in changed || 'start_time' in changed) {
      // Khi User đổi phim, báo lỗi Validation nếu phim đó khởi chiếu sau Start_time đang chọn
      if ('movie_id' in changed && selectedStartTime) {
         form.validateFields(['start_time']).catch(() => {});
      }
      runConflictCheck();
    }
  };

  const handleOk = async () => {
    if (conflictMsg) return;
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // Ant Design tự hiển thị lỗi validation
    }
  };

  return (
    <Modal
      open={open}
      title={editTarget ? '✏️ Sửa lịch chiếu' : '➕ Thêm lịch chiếu'}
      okText={editTarget ? 'Cập nhật' : 'Tạo lịch chiếu'}
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okButtonProps={{ disabled: !!conflictMsg }}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        style={{ marginTop: 12 }}
      >
        {/* CHỌN PHIM */}
        <Form.Item
          name="movie_id"
          label={<Text strong>Phim chiếu</Text>}
          rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
        >
          <Select
            showSearch
            placeholder="Chọn phim..."
            filterOption={(input, opt) =>
              String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            // MAPPING DANH SÁCH ĐÃ LỌC (validMovies) THAY VÌ movies
            options={validMovies.map(m => {
              const releaseStr = (m as any).releaseDate;
              // Hiển thị thêm ngày KC (Khởi chiếu) trong tên cho Admin dễ nhìn
              const dateTxt = releaseStr ? ` (KC: ${dayjs(releaseStr).format('DD/MM/YYYY')})` : '';
              return {
                value: m.id,
                label: `${m.title} - ${m.duration} phút${dateTxt}`,
              };
            })}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="cinema_id"
              label={<Text strong>Rạp chiếu</Text>}
              rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
            >
              <Select
                showSearch
                placeholder="Chọn rạp..."
                onChange={handleCinemaChange}
                options={cinemas.map(c => ({ value: c.id, label: c.cinema_name }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="room_id"
              label={<Text strong>Phòng chiếu</Text>}
              rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}
            >
              <Select
                showSearch
                placeholder="Chọn phòng..."
                loading={roomLoading}
                disabled={!rooms || rooms.length === 0}
                options={rooms?.map(r => ({
                  value: r.id,
                  label: `${r.room_name} (${r.capacity} ghế)`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* CHỌN THỜI GIAN */}
        <Form.Item
          name="start_time"
          label={<Text strong>Thời gian bắt đầu</Text>}
          rules={[
            { required: true, message: 'Vui lòng chọn giờ chiếu' },
            // Khóa bảo mật: Validation cứng ngăn Admin submit nếu ngày chiếu sai lệch
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) return Promise.resolve();
                const movieId = getFieldValue('movie_id');
                if (movieId) {
                   const movie = movies.find(m => m.id === movieId);
                   const releaseStr = (movie as any)?.releaseDate;
                   if (releaseStr) {
                     const releaseDate = dayjs(releaseStr).startOf('day');
                     if (dayjs(value).isBefore(releaseDate, 'day')) {
                       return Promise.reject(new Error('Lỗi: Ngày chiếu phải sau ngày khởi chiếu của phim!'));
                     }
                   }
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm', minuteStep: 5 }}
            format={DATETIME_FORMAT}
            // ÁP DỤNG HÀM TÙY CHỈNH NGÀY DISABLED
            disabledDate={customDisableDate}
            placeholder="Chọn ngày và giờ chiếu..."
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* ─── Cấu hình giá vé theo loại ghế ─── */}
        <Divider orientation="left" style={{ margin: '12px 0' }}>
          <Space><DollarOutlined /> <Text strong>Giá vé theo loại ghế</Text></Space>
        </Divider>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          {SEAT_TYPES.map((type, index) => (
            <Row gutter={16} key={type.value} align="middle" style={{ marginBottom: index === SEAT_TYPES.length - 1 ? 0 : 12 }}>
              <Col span={10}>
                <Text>{type.label}</Text>
                <Form.Item name={['seat_prices', index, 'seat_type']} initialValue={type.value} hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  name={['seat_prices', index, 'price']}
                  rules={[
                    { required: true, message: 'Nhập giá' },
                    { type: 'number', min: MIN_PRICE, message: `Tối thiểu ${formatVND(MIN_PRICE)}` }
                  ]}
                  noStyle
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={PRICE_STEP}
                    placeholder="Nhập giá vé..."
                    formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={val => Number(val?.replace(/\./g, '') || 0) as any}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </div>

        {/* Thông báo xung đột lịch chiếu */}
        {conflictChecking && (
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Spin size="small" />
            <Text type="secondary">Đang kiểm tra lịch trống của phòng...</Text>
          </div>
        )}

        {!conflictChecking && conflictMsg && (
          <Alert
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            message="Xung đột lịch chiếu"
            description={conflictMsg}
          />
        )}
      </Form>
    </Modal>
  );
};

export default ShowtimeModal;