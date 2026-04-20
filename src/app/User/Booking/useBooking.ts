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

  const [step, setStep] = useState<1 | 2>(1); 

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
  const [vouchers, setVouchers] = useState<Voucher[]>([]); 
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [checkingVoucher, setCheckingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  // --- QUẢN LÝ ĐIỂM TÍCH LŨY ---
  const [isUsingPoints, setIsUsingPoints] = useState(false);
  const userPoints = user?.points || 0; 
  const POINTS_EXCHANGE_RATE = 1;

  const socketRef = useRef<Socket | null>(null);

  // ==========================================
  // KẾT NỐI SOCKET & XỬ LÝ REAL-TIME
  // ==========================================
 useEffect(() => {
  if (!id) return;

      const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        transports: ["websocket"], 
        withCredentials: true,

        autoConnect: false,      

        reconnection: true,   
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      // 🔥 Delay connect (tránh server sleep)
      setTimeout(() => {
        socket.connect();
      }, 2000);
    // 1. Nhận danh sách ghế đang bị giữ từ BE
    socket.on('currentHoldingSeats', (data: Record<string, string>) => {
      // data có dạng { "seatId": "socketId" }
      const heldIds = Object.keys(data)
        .map(Number)
        .filter(seatId => data[seatId] !== socket.id); // So sánh với socket.id hiện tại
      
      setHoldingSeats(heldIds);
    });

    // 2. Có người khác vừa click chọn ghế
    socket.on('seatHeld', ({ seatId, socketId }) => {
      // Nếu socketId của người vừa chọn KHÁC với socket.id của tab này -> Bôi xám
      if (socketId !== socket.id) {
        setHoldingSeats(prev => [...prev, Number(seatId)]);
      }
    });

    // 3. Có người khác vừa bỏ chọn ghế
    socket.on('seatReleased', ({ seatId, socketId }) => {
      if (socketId !== socket.id) {
        setHoldingSeats(prev => prev.filter(hid => hid !== Number(seatId)));
      }
    });

    // 4. CÓ NGƯỜI VỪA THANH TOÁN THÀNH CÔNG
    socket.on('seatsBooked', ({ seatIds }: { seatIds: number[] }) => {
      setSeats(prev => prev.map(seat => 
        seatIds.includes(seat.id) ? { ...seat, isBooked: true } : seat
      ));
      setHoldingSeats(prev => prev.filter(hid => !seatIds.includes(hid)));
      setSelectedSeats(prev => prev.filter(seat => !seatIds.includes(seat.id)));
    });

    // Cleanup khi rời trang
    return () => {
      socket.emit('leaveShowtime', { showtimeId: id });
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [showtimeRes, productsRes, vouchersRes] = await Promise.all([
          getShowtimeDetails(id as string),
          getProducts(),
          getActiveVouchers()
        ]);

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
        
        const priceMap: Record<string, number> = {};
        rawPrices.forEach((p: any) => { priceMap[p.seat_type] = Number(p.price); });

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

        const fetchedProducts = productsRes.data?.data?.products || productsRes.data?.data || [];
        const formattedProducts: Product[] = fetchedProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          image: p.image || p.imageUrl || '', 
          description: p.description || ''
        }));
        setProducts(formattedProducts);

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

  // Nhóm ghế theo hàng
  const seatRows = useMemo(() => {
    const rows: Record<string, Seat[]> = {};
    seats.forEach(seat => {
      if (!rows[seat.seat_row]) rows[seat.seat_row] = [];
      rows[seat.seat_row].push(seat);
    });
    return rows;
  }, [seats]);

  // ==========================================
  // CLICK CHỌN GHẾ
  // ==========================================
  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked || holdingSeats.includes(seat.id)) return; 

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      // Không cần gửi userId nữa, Backend sẽ tự dùng socket.id
      socketRef.current?.emit('releaseSeat', { showtimeId: id, seatId: seat.id });
    } else {
      if (selectedSeats.length >= 8) return message.warning("Tối đa 8 vé!");
      setSelectedSeats([...selectedSeats, seat]);
      // Không cần gửi userId nữa, Backend sẽ tự dùng socket.id
      socketRef.current?.emit('holdSeat', { showtimeId: id, seatId: seat.id });
    }
  };

  // Logic Chọn Sản phẩm
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

  // Tính toán tiền
  const seatsPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
  const productsPrice = selectedProducts.reduce((total, p) => total + (p.price * p.quantity), 0);
  const originalTotalPrice = seatsPrice + productsPrice;
  const maxPriceCanBeDiscounted = originalTotalPrice - discountAmount;
  const pointsDiscountAmount = isUsingPoints ? Math.min(userPoints * POINTS_EXCHANGE_RATE, maxPriceCanBeDiscounted) : 0;
  const finalTotalPrice = originalTotalPrice - discountAmount - pointsDiscountAmount;

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
      if (code !== voucherCode) setVoucherCode(code); 
      
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

  // Nút Bấm Đáy (Tiếp tục -> Thanh toán)
  const handleNextOrCheckout = async () => {
    if (step === 1) {
      if (selectedSeats.length === 0) return message.error("Vui lòng chọn ít nhất 1 ghế!");
      if (!user || !token) {
         message.warning("Vui lòng đăng nhập để đặt vé!");
         navigate('/login');
         return;
      }
      setStep(2); 
    } else {
      setSubmitting(true);
      try {
        const payload = {
          showtime_id: Number(id),
          seat_ids: selectedSeats.map(s => s.id),
          products: selectedProducts.map(p => ({ product_id: p.id, quantity: p.quantity })), 
          payment_method: "VN_PAY" ,
          voucher_code: appliedVoucher || undefined,
          points_used: isUsingPoints ? Math.floor(pointsDiscountAmount / POINTS_EXCHANGE_RATE) : 0
        };
        if (!token) {
            message.error("Vui lòng đăng nhập!");
            return;
        }
        const res = await createBooking(payload);
        message.success("Tạo đơn hàng thành công!");
        
        if (res.data.data.paymentUrl) window.location.href = res.data.data.paymentUrl;
        else navigate('/my-tickets'); 
      } catch (error: any) {
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
    userPoints, isUsingPoints, setIsUsingPoints, pointsDiscountAmount,
    vouchers,
    voucherCode, setVoucherCode, appliedVoucher, discountAmount, checkingVoucher, voucherError,
    handleApplyVoucher, handleCancelVoucher,
  };
};