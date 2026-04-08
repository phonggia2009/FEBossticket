import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { RootState } from '../../../store';
import { getShowtimeDetails, createBooking, getProducts, checkVoucher, getActiveVouchers } from '../../../common/api/userAPI'; 
import type { Seat, ShowtimeInfo, Product, SelectedProduct, Voucher } from './types';

export const useBooking = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  // --- QUẢN LÝ LUỒNG ---
  const [step, setStep] = useState<1 | 2>(1); // 1: Chọn ghế, 2: Chọn bắp nước

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [showtime, setShowtime] = useState<ShowtimeInfo | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [holdingSeats, setHoldingSeats] = useState<number[]>([]);

  // --- QUẢN LÝ BẮP NƯỚC ---
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  // --- QUẢN LÝ VOUCHER ---
  const [vouchers, setVouchers] = useState<Voucher[]>([]); // Thêm state lưu danh sách voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checkingVoucher, setCheckingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  const clientId = useRef<string>(user?.id?.toString() || Math.random().toString(36).substring(7));
  const socketRef = useRef<Socket | null>(null);

  // Kết nối socket
  useEffect(() => {
    if (!id) return;

    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    const socket = socketRef.current;

    // 1. Tham gia phòng chiếu
    socket.emit('joinShowtime', { showtimeId: id });

    // 2. Nhận danh sách ghế đang bị giữ từ server
    socket.on('currentHoldingSeats', (data: Record<string, string>) => {
      // data có dạng { "seatId": "userId" }
      const heldIds = Object.keys(data)
        .map(Number)
        .filter(seatId => data[seatId] !== clientId.current); // Bỏ qua các ghế do chính mình đang giữ
      setHoldingSeats(heldIds);
    });

    // 3. Có người khác vừa click chọn ghế
    socket.on('seatHeld', ({ seatId, userId }) => {
      if (userId !== clientId.current) {
        setHoldingSeats(prev => [...prev, Number(seatId)]);
      }
    });

    // 4. Có người khác vừa bỏ chọn ghế
    socket.on('seatReleased', ({ seatId, userId }) => {
      if (userId !== clientId.current) {
        setHoldingSeats(prev => prev.filter(hid => hid !== Number(seatId)));
      }
    });

    // 5. CÓ NGƯỜI VỪA THANH TOÁN THÀNH CÔNG
    socket.on('seatsBooked', ({ seatIds }: { seatIds: number[] }) => {
      // Đổi trạng thái ghế trong state `seats` thành Đã bán (isBooked: true)
      setSeats(prev => prev.map(seat => 
        seatIds.includes(seat.id) ? { ...seat, isBooked: true } : seat
      ));
      // Xoá khỏi danh sách đang chọn
      setHoldingSeats(prev => prev.filter(hid => !seatIds.includes(hid)));
      // Nếu không may mình đang chọn trúng ghế người ta vừa mua xong -> Xoá khỏi selectedSeats của mình
      setSelectedSeats(prev => prev.filter(seat => !seatIds.includes(seat.id)));
    });

    // Cleanup khi rời trang
    return () => {
      socket.emit('leaveShowtime', { showtimeId: id });
      socket.disconnect();
    };
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Đã thêm getActiveVouchers() vào Promise.all
        const [showtimeRes, productsRes, vouchersRes] = await Promise.all([
          getShowtimeDetails(id as string),
          getProducts(),
          getActiveVouchers()
        ]);

        // ==========================================
        // XỬ LÝ DỮ LIỆU SUẤT CHIẾU VÀ GHẾ
        // ==========================================
        const data = showtimeRes.data?.data?.showtime || showtimeRes.data?.data;
        if (!data) throw new Error("Không có dữ liệu suất chiếu");

        setShowtime({
          id: data.id,
          movie_title: data.movie?.title || data.Movie?.title || 'Đang cập nhật',
          cinema_name: data.room?.cinema?.cinema_name || data.Room?.Cinema?.cinema_name || 'Đang cập nhật',
          room_name: data.room?.room_name || data.Room?.room_name || 'Phòng chiếu',
          start_time: data.start_time,
          price: Number(data.price) || 0
        });

        const rawSeats = data.room?.seats || data.Room?.Seats || [];
        const rawTickets = data.tickets || data.Tickets || [];
        const bookedSeatIds = rawTickets.map((t: any) => t.seat_id);
        const rawPrices = data.seat_prices || data.SeatPrices || [];
        
        // Tạo một object ánh xạ giá cho nhanh
        const priceMap: Record<string, number> = {};
        rawPrices.forEach((p: any) => {
          priceMap[p.seat_type] = Number(p.price);
        });

        const formattedSeats: Seat[] = rawSeats.map((s: any) => {
          const type = s.seat_type || 'NORMAL';
          return {
            id: s.id,
            seat_row: s.seat_row,
            seat_number: s.seat_number,
            seat_type: type,
            isBooked: bookedSeatIds.includes(s.id),
            price: priceMap[type] || 50000 
          };
        });
        
        setSeats(formattedSeats);

        // ==========================================
        // XỬ LÝ DỮ LIỆU SẢN PHẨM (BẮP NƯỚC)
        // ==========================================
        const fetchedProducts = productsRes.data?.data?.products || productsRes.data?.data || [];
        
        const formattedProducts: Product[] = fetchedProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          image: p.image || p.imageUrl || '', 
          description: p.description || ''
        }));

        setProducts(formattedProducts);

        // ==========================================
        // XỬ LÝ DỮ LIỆU DANH SÁCH MÃ GIẢM GIÁ
        // ==========================================
        const fetchedVouchers = vouchersRes.data?.data || vouchersRes.data || [];
        setVouchers(fetchedVouchers);

      } catch (error) {
        console.error("Lỗi fetch data Booking:", error);
        message.error("Lỗi lấy thông tin đặt vé!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // 2. Nhóm ghế
  const seatRows = useMemo(() => {
    const rows: Record<string, Seat[]> = {};
    seats.forEach(seat => {
      if (!rows[seat.seat_row]) rows[seat.seat_row] = [];
      rows[seat.seat_row].push(seat);
    });
    return rows;
  }, [seats]);

  // 3. Logic click chọn ghế
  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked || holdingSeats.includes(seat.id)) return; 

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      socketRef.current?.emit('releaseSeat', { showtimeId: id, seatId: seat.id, userId: clientId.current });
    } else {
      if (selectedSeats.length >= 8) return message.warning("Tối đa 8 vé!");
      setSelectedSeats([...selectedSeats, seat]);
      socketRef.current?.emit('holdSeat', { showtimeId: id, seatId: seat.id, userId: clientId.current });
    }
  };

  // 4. Logic Chọn Sản phẩm
  const handleProductChange = (product: Product, quantity: number) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        if (quantity === 0) return prev.filter(p => p.id !== product.id);
        return prev.map(p => p.id === product.id ? { ...p, quantity } : p);
      }
      if (quantity > 0) return [...prev, { ...product, quantity }];
      return prev;
    });
  };

  const seatsPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
  const productsPrice = selectedProducts.reduce((total, p) => total + (p.price * p.quantity), 0);
  const originalTotalPrice = seatsPrice + productsPrice;
  const finalTotalPrice = originalTotalPrice - discountAmount;

  // Đã cập nhật để nhận vào tham số codeToApply (nếu được truyền từ dropdown)
  const handleApplyVoucher = async (codeToApply?: string) => {
    const code = typeof codeToApply === 'string' ? codeToApply : voucherCode;
    
    if (!code.trim()) {
      setVoucherError('Vui lòng nhập hoặc chọn mã giảm giá');
      return;
    }
    
    setCheckingVoucher(true);
    setVoucherError('');
    try {
      const res = await checkVoucher({ code: code, original_price: originalTotalPrice });
      const discount = res.data?.data?.discountAmount || 0;
      
      setDiscountAmount(discount);
      setAppliedVoucher(code);
      if (code !== voucherCode) setVoucherCode(code); // Cập nhật lại thanh input nếu code từ Dropdown
      
      message.success('Áp dụng mã giảm giá thành công!');
    } catch (error: any) {
      setDiscountAmount(0);
      setAppliedVoucher('');
      setVoucherCode('');
      setVoucherError(error.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn');
    } finally {
      setCheckingVoucher(false);
    }
  };

  const handleCancelVoucher = () => {
    setDiscountAmount(0);
    setAppliedVoucher('');
    setVoucherCode('');
    setVoucherError('');
  };

  // 5. Logic Nút Bấm Đáy (Tiếp tục -> Thanh toán)
  const handleNextOrCheckout = async () => {
    if (step === 1) {
      if (selectedSeats.length === 0) return message.error("Vui lòng chọn ít nhất 1 ghế!");
      if (!user || !token) {
         message.warning("Vui lòng đăng nhập để đặt vé!");
         navigate('/login');
         return;
      }
      // Chuyển sang bước chọn Bắp nước
      setStep(2); 
    } else {
      // Đang ở bước 2 -> THANH TOÁN THẬT
      setSubmitting(true);
      try {
        const payload = {
          showtime_id: Number(id),
          seat_ids: selectedSeats.map(s => s.id),
          products: selectedProducts.map(p => ({ product_id: p.id, quantity: p.quantity })), 
          payment_method: "VN_PAY" ,
          voucher_code: appliedVoucher || undefined
        };
        if (!token) {
            message.error("Vui lòng đăng nhập!");
            return;
        }
        const res = await createBooking(payload);
        console.log('FULL RESPONSE:', res.data); 
        message.success("Tạo đơn hàng thành công!");
        
        if (res.data.data.paymentUrl) window.location.href = res.data.data.paymentUrl;
        else navigate('/my-tickets'); 
      } catch (error: any) {
        console.log('LỖI 400:', error.response?.data); 
        message.error(error.response?.data?.message || "Lỗi thanh toán!");
        setTimeout(() => window.location.reload(), 1500); 
      } finally {
        setSubmitting(false);
      }
    }
  };

  return {
    loading, submitting, showtime, 
    step, setStep,
    seats, selectedSeats, holdingSeats, seatRows, handleSeatClick, 
    products, selectedProducts, handleProductChange,
    handleNextOrCheckout,
    seatsPrice, productsPrice, originalTotalPrice, finalTotalPrice,
    // Trả thêm danh sách vouchers
    vouchers,
    voucherCode, setVoucherCode, appliedVoucher, discountAmount, checkingVoucher, voucherError,
    handleApplyVoucher, handleCancelVoucher
  };
};