import React from 'react';
import type { Seat } from '../types';

interface Props {
  seatRows: Record<string, Seat[]>;
  selectedSeats: Seat[];
  holdingSeats: number[]; // <-- Thêm prop holdingSeats
  onSeatClick: (seat: Seat) => void;
}

const SeatMap: React.FC<Props> = ({ seatRows, selectedSeats, holdingSeats, onSeatClick }) => {
  return (
    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden">
      {/* Màn hình (Screen) */}
      <div className="w-full flex flex-col items-center mb-16">
        <div className="w-full max-w-2xl h-2 bg-zinc-600 rounded-full mb-4 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"></div>
        <span className="text-zinc-500 uppercase tracking-widest text-sm font-bold">Màn Hình Chiếu</span>
      </div>

      {/* Lưới ghế */}
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
        <div className="min-w-[600px] flex flex-col items-center gap-3">
          {Object.entries(seatRows).sort().map(([rowName, rowSeats]) => (
            <div key={rowName} className="flex items-center gap-4">
              <div className="w-6 font-bold text-zinc-500 text-center">{rowName}</div>
              
              <div className="flex gap-2">
                {rowSeats.sort((a, b) => a.seat_number - b.seat_number).map((seat) => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const isHeld = holdingSeats.includes(seat.id); // <-- Kiểm tra ghế bị người khác giữ
                  const isCouple = seat.seat_type === 'COUPLE';
                  
                  const seatWidth = isCouple ? "w-[44px] md:w-[48px]" : "w-10 md:w-11";
                  
                  // XỬ LÝ MÀU SẮC GHẾ
                  let seatClass = "bg-zinc-700 border-zinc-600 text-transparent hover:bg-zinc-600";
                  
                  if (seat.isBooked) {
                    seatClass = "bg-zinc-950 border-zinc-800 cursor-not-allowed opacity-40 text-transparent";
                  } else if (isHeld) {
                    // MÀU GHẾ NGƯỜI KHÁC ĐANG CHỌN (Màu cam nhạt)
                    seatClass = "bg-orange-500/20 border-orange-500/50 cursor-not-allowed text-transparent";
                  } else if (isSelected) {
                    seatClass = "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50"; 
                  } else if (seat.seat_type === 'VIP') {
                    seatClass = "bg-yellow-600/20 border-yellow-600/50 text-transparent hover:bg-yellow-600/40";
                  } else if (isCouple) {
                    seatClass = "bg-pink-600/20 border-pink-600/50 text-transparent hover:bg-pink-600/40";
                  }

                  return (
                    <button
                      key={seat.id}
                      disabled={seat.isBooked || isHeld} // <-- Khóa không cho click nếu người khác đang giữ
                      onClick={() => onSeatClick(seat)}
                      className={`${seatWidth} h-10 md:h-11 rounded-t-xl rounded-b-md border transition-all duration-200 flex flex-col items-center justify-center font-bold text-xs ${seatClass} relative`}
                    >
                      {isSelected && <span className="z-10">{seat.seat_row}{seat.seat_number}</span>}
                      {isCouple && !isSelected && !seat.isBooked && (
                        <svg className="w-5 h-5 text-pink-600/40 absolute" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="w-6 font-bold text-zinc-500 text-center">{rowName}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chú thích màu ghế */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-zinc-800 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-700 rounded border border-zinc-600"></div>
          <span className="text-zinc-400 text-sm">Ghế thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-600/20 rounded border border-yellow-600/50"></div>
          <span className="text-zinc-400 text-sm">Ghế VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-6 bg-pink-600/20 rounded border border-pink-600/50 flex items-center justify-center">
             <svg className="w-3 h-3 text-pink-600/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="text-zinc-400 text-sm">Ghế Couple</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded border border-red-500"></div>
          <span className="text-zinc-400 text-sm">Ghế đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500/20 rounded border border-orange-500/50"></div>
          <span className="text-zinc-400 text-sm">Người khác đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-950 opacity-50 rounded border border-zinc-800"></div>
          <span className="text-zinc-400 text-sm">Đã bán</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;