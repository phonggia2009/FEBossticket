import React from 'react';
import { Spin } from 'antd';
import type { Seat, ShowtimeInfo, SelectedProduct } from '../types';

interface Props {
  step: 1 | 2;
  showtime: ShowtimeInfo;
  selectedSeats: Seat[];
  selectedProducts: SelectedProduct[];
  submitting: boolean;
  onNextOrCheckout: () => void;
  // Các props mới
  seatsPrice: number;
  productsPrice: number;
  originalTotalPrice: number;
  finalTotalPrice: number;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  appliedVoucher: string;
  discountAmount: number;
  checkingVoucher: boolean;
  voucherError: string;
  onApplyVoucher: () => void;
  onCancelVoucher: () => void;
}

const TicketSummary: React.FC<Props> = ({ 
  step, showtime, selectedSeats, selectedProducts, submitting, onNextOrCheckout,
  seatsPrice, productsPrice, originalTotalPrice, finalTotalPrice,
  voucherCode, setVoucherCode, appliedVoucher, discountAmount, checkingVoucher, voucherError,
  onApplyVoucher, onCancelVoucher
}) => {

  const fmtPrice = (n: number) => n.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="w-full lg:w-96 flex-shrink-0">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl sticky top-24 transition-all">
        <div className="p-6">
          <h2 className="text-xl font-black text-white uppercase tracking-wide mb-4 line-clamp-2">
            {showtime.movie_title}
          </h2>
          
          {/* Thông tin suất chiếu */}
          <div className="space-y-3 mb-6 border-b border-zinc-800 pb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Rạp:</span>
              <span className="text-white font-bold">{showtime.cinema_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Phòng:</span>
              <span className="text-white font-bold">{showtime.room_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Suất chiếu:</span>
              <span className="text-red-500 font-bold">
                {new Date(showtime.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                {' - '} 
                {new Date(showtime.start_time).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {/* Hiển thị ghế */}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Ghế chọn:</span>
              <span className="text-white font-bold text-right max-w-[150px] leading-relaxed">
                {selectedSeats.length > 0 ? selectedSeats.map(s => `${s.seat_row}${s.seat_number}`).join(', ') : '---'}
              </span>
            </div>

            {/* Hiển thị bắp nước */}
            {selectedProducts.length > 0 && (
              <div className="flex justify-between text-sm pt-3 border-t border-zinc-800/50">
                <span className="text-zinc-400">Bắp nước:</span>
                <div className="text-right">
                  {selectedProducts.map(p => (
                    <div key={p.id} className="text-white font-medium mb-1 last:mb-0">
                      {p.quantity}x {p.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* KHU VỰC VOUCHER CHỈ HIỂN THỊ Ở BƯỚC 2        */}
          {/* ========================================== */}
          {step === 2 && (
            <div className="mb-6 border-t border-zinc-800 pt-5">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={discountAmount > 0}
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500/50 uppercase disabled:opacity-50 transition-colors"
                />
                {discountAmount > 0 ? (
                  <button 
                    onClick={onCancelVoucher}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    Hủy
                  </button>
                ) : (
                  <button 
                    onClick={onApplyVoucher}
                    disabled={checkingVoucher || !voucherCode.trim()}
                    className="px-4 py-2.5 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500 font-bold text-sm hover:bg-red-600/40 disabled:opacity-50 disabled:border-zinc-700 disabled:text-zinc-500 disabled:bg-zinc-800 transition-colors"
                  >
                    {checkingVoucher ? <Spin size="small" /> : 'Áp dụng'}
                  </button>
                )}
              </div>
              {voucherError && <p className="text-red-400 text-xs mt-2 font-medium">{voucherError}</p>}
              {discountAmount > 0 && (
                <p className="text-emerald-400 text-xs mt-2 font-medium">
                  ✅ Áp dụng thành công mã {appliedVoucher}
                </p>
              )}
            </div>
          )}

          {/* Tổng tiền */}
          <div className="flex flex-col items-end border-t border-zinc-800 pt-5 mb-6 gap-1.5">
            {selectedProducts.length > 0 && (
              <div className="w-full flex justify-between text-sm text-zinc-500">
                <span>Vé: {fmtPrice(seatsPrice)}</span>
                <span>Đồ ăn: {fmtPrice(productsPrice)}</span>
              </div>
            )}
            
            {/* Hiển thị chi tiết giảm giá nếu có */}
            {discountAmount > 0 && (
              <div className="w-full flex justify-between text-sm text-emerald-500">
                <span>Tạm tính: {fmtPrice(originalTotalPrice)}</span>
                <span className="font-bold">- {fmtPrice(discountAmount)}</span>
              </div>
            )}

            <div className="w-full flex justify-between items-end mt-2">
              <span className="text-zinc-400 font-bold uppercase">Tổng tiền</span>
              <span className="text-3xl font-black text-red-500">
                {fmtPrice(finalTotalPrice)}
              </span>
            </div>
          </div>

          <button
            disabled={selectedSeats.length === 0 || submitting}
            onClick={onNextOrCheckout}
            className={`w-full py-4 rounded-xl font-black text-lg tracking-wider transition-all duration-300 shadow-lg ${
              selectedSeats.length > 0 && !submitting
                ? 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 shadow-red-900/40' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {submitting ? <Spin /> : (step === 1 ? 'TIẾP TỤC' : 'THANH TOÁN')}
          </button>
        </div>
        
        {/* Đường viền Ticket */}
        <div className="h-4 bg-black border-t border-dashed border-zinc-700 relative">
           <div className="absolute -top-2 -left-2 w-4 h-4 bg-black rounded-full border border-zinc-800"></div>
           <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full border border-zinc-800"></div>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;