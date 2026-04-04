import React, { useState } from 'react';
import type { Booking } from '../type';
import { FilmIcon } from './Icon';
import { QRCodeCanvas } from 'qrcode.react';

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  SUCCESS:   { label: 'Đã thanh toán',  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  USED:      { label: 'Đã sử dụng',     cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  PENDING:   { label: 'Chờ thanh toán', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  EXPIRED:   { label: 'Hết hạn',        cls: 'bg-zinc-700/40 text-zinc-500 border-zinc-700/40' },
  CANCELLED: { label: 'Đã huỷ',         cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const SEAT_TYPE_COLOR: Record<string, string> = {
  VIP:    'text-amber-400',
  COUPLE: 'text-pink-400',
  NORMAL: 'text-zinc-400',
};

const fmt = (iso: string) => new Date(iso).toLocaleString('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const fmtPrice = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

interface Props {
  b: Booking;
  paying: boolean;
  canceling?: boolean;
  onRetryPayment: (bookingId: number) => void;
  onCancelBooking?: (bookingId: number) => void;
}

export const OrderCard = ({ b, paying, canceling, onRetryPayment, onCancelBooking }: Props) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // <-- State mở UI xác nhận hủy

  const downloadQR = (bookingId: number) => {
    const canvas = document.getElementById(`qr-code-${bookingId}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ticket-${bookingId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  const st   = STATUS_CONFIG[b.status] || STATUS_CONFIG.CANCELLED;
  const show = b.showtime;

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/70 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-200">

      {/* ── Main row ── */}
      <div className="flex gap-4 p-4 sm:p-5">

        {/* Poster */}
        <div className="flex-shrink-0">
          {show?.movie?.posterUrl ? (
            <img
              src={show.movie.posterUrl}
              alt={show.movie.title}
              className="w-[68px] h-[96px] sm:w-20 sm:h-28 object-cover rounded-xl border border-zinc-800"
            />
          ) : (
            <div className="w-[68px] h-[96px] sm:w-20 sm:h-28 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600">
              <FilmIcon />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">

          {/* Tên phim + badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2">
              {show?.movie?.title ?? '—'}
            </h3>
            <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${st.cls}`}>
              {st.label}
            </span>
          </div>

          {/* Rạp + phòng */}
          <p className="text-zinc-400 text-xs">
            🏛 {show?.room?.cinema?.cinema_name}
            <span className="text-zinc-600 mx-1">·</span>
            {show?.room?.room_name}
          </p>

          {/* Giờ chiếu */}
          <p className="text-zinc-400 text-xs">
            🕐 {show?.start_time ? fmt(show.start_time) : '—'}
          </p>

          {/* Ghế tóm tắt */}
          {b.tickets?.length > 0 && (
            <p className="text-zinc-400 text-xs flex flex-wrap items-center gap-x-1">
              🎟{' '}
              {b.tickets.map((t, i) => (
                <span key={t.id}>
                  <span className={`font-medium ${SEAT_TYPE_COLOR[t.seat?.seat_type] || 'text-zinc-300'}`}>
                    {t.seat?.seat_row}{t.seat?.seat_number}
                  </span>
                  {i < b.tickets.length - 1 && <span className="text-zinc-600">,</span>}
                </span>
              ))}
            </p>
          )}

          {/* Giá + chi tiết */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-red-400 font-bold text-sm">{fmtPrice(b.total_price)}</span>
            <button
              onClick={() => setOpen(!open)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {open ? 'Thu gọn ▲' : 'Chi tiết ▼'}
            </button>
          </div>

          {/* NÚT THANH TOÁN / HỦY KHI PENDING */}
          {b.status === 'PENDING' && (
            <div className="mt-1 w-full flex gap-2 overflow-hidden">
              {!showConfirm ? (
                <>
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={canceling || paying}
                    className="flex-1 py-2 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-red-500 hover:text-white hover:bg-red-500/10 text-zinc-400 font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {canceling ? 'Đang hủy...' : 'Hủy đơn'}
                  </button>
                  <button
                    onClick={() => onRetryPayment(b.booking_id)}
                    disabled={paying || canceling}
                    className="flex-[2] flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-xs transition-colors"
                  >
                    {paying ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Thanh toán ngay
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* GIAO DIỆN XÁC NHẬN HỦY (Thay cho Popconfirm) */
                <div className="w-full flex items-center justify-between gap-2 p-1 bg-zinc-800/80 rounded-xl border border-red-500/40 animate-fadeIn">
                  <span className="text-xs text-zinc-300 font-medium px-2">Xác nhận hủy?</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 bg-zinc-900 hover:text-white transition-colors"
                    >
                      Không
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                        onCancelBooking?.(b.booking_id);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-900/50 transition-colors"
                    >
                      Đồng ý
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Badge hết hạn — chỉ hiện khi EXPIRED */}
          {b.status === 'EXPIRED' && (
            <div className="mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-500 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Đơn đã hết hạn sau suất chiếu
            </div>
          )}
        </div>
      </div>

      {/* ── Chi tiết mở rộng ── */}
      {open && (
        <div className="border-t border-zinc-800/60 px-4 sm:px-5 py-4 space-y-4 bg-zinc-950/50 animate-fadeIn">
          {/* Ghế chi tiết */}
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Ghế đã đặt</p>
            <div className="flex flex-wrap gap-2">
              {b.tickets.map(t => (
                <div key={t.id} className="flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-1.5">
                  <span className={`text-xs font-bold ${SEAT_TYPE_COLOR[t.seat?.seat_type] || 'text-zinc-300'}`}>
                    {t.seat?.seat_row}{t.seat?.seat_number}
                  </span>
                  <span className="text-zinc-600 text-xs">·</span>
                  <span className="text-zinc-500 text-xs">{t.seat?.seat_type}</span>
                  <span className="text-zinc-600 text-xs">·</span>
                  <span className="text-zinc-400 text-xs">{fmtPrice(t.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bắp & nước */}
          {b.products?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Bắp & Nước</p>
              <div className="space-y-2">
                {b.products.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.product_name}
                          className="w-6 h-6 rounded object-cover border border-zinc-700"
                        />
                      )}
                      <span className="text-zinc-300">{item.product?.product_name}</span>
                      <span className="text-zinc-600">×{item.quantity}</span>
                    </div>
                    <span className="text-zinc-400">{fmtPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {b.status === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center p-5 bg-white rounded-xl mt-2 mb-4 max-w-[220px] mx-auto shadow-sm">
              <QRCodeCanvas 
                id={`qr-code-${b.booking_id}`} // Gắn ID để hàm download bắt được
                value={b.booking_id.toString()} 
                size={150} 
                level={"H"}
              />
              <p className="text-black font-black mt-3 text-base">Mã: #{b.booking_id}</p>
              <p className="text-zinc-500 text-xs text-center mb-3">Đưa mã này cho nhân viên để soát vé</p>
              
              <button 
                onClick={() => downloadQR(b.booking_id)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Tải ảnh về máy
              </button>
            </div>
          )}
          {/* Mã đơn + ngày đặt + tổng */}
          <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
            <div>
              <p className="text-zinc-600 text-xs">
                Mã đơn: <span className="text-zinc-400 font-mono">#{b.booking_id}</span>
              </p>
              <p className="text-zinc-500 text-xs">Đặt lúc: {fmt(b.booking_time)}</p>
            </div>
            <span className="text-white font-bold text-sm">Tổng: {fmtPrice(b.total_price)}</span>
          </div>
        </div>
      )}
    </div>
  );
};