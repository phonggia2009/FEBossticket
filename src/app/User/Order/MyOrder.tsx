import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from './useMyOrders';
import { OrderCard } from './components/OrderCard';
import { FilterTabs } from './components/FilterTab';
import { Skeleton } from './components/Skeleton';
import { OrderIcon } from './components/Icon';

const ITEMS_PER_PAGE = 5;

const MyOrders: React.FC = () => {
  const {
    bookings, filteredBookings, loading, filter, setFilter,
    payingId, handleRetryPayment, cancelingId, handleCancelBooking,
    toast
  } = useMyOrders();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (f: typeof filter) => {
    setFilter(f);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-5 md:right-10 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border bg-zinc-900 transition-all duration-300 ${
          toast.type === 'success' ? 'border-emerald-500/50' : 'border-red-500/50'
        }`}>
          {toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <div>
            <h4 className={`text-sm font-bold ${toast.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {toast.type === 'success' ? 'Thành công' : 'Thất bại'}
            </h4>
            <p className="text-zinc-300 text-xs font-medium mt-0.5">{toast.msg}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-red-600/20 border border-red-600/40 rounded-xl flex items-center justify-center text-red-400">
          <OrderIcon />
        </div>
        <div>
          <h1 className="text-white font-black text-xl">Đơn hàng của tôi</h1>
          <p className="text-zinc-500 text-xs">Lịch sử đặt vé & mua hàng của bạn</p>
        </div>
      </div>

      <FilterTabs
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        bookings={bookings}
      />

      {loading ? (
        <Skeleton />
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-zinc-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-600">
            <OrderIcon />
          </div>
          <p className="text-zinc-400 font-medium">Không có đơn hàng nào</p>
          <Link to="/" className="inline-block mt-5 px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl">
            Khám phá phim
          </Link>
        </div>
      ) : (
        <>
          {/* Danh sách vé */}
          <div className="space-y-3">
            {paginatedBookings.map(b => (
              <OrderCard
                key={b.booking_id}
                b={b}
                paying={payingId === b.booking_id}
                canceling={cancelingId === b.booking_id}
                onRetryPayment={handleRetryPayment}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Sau →
              </button>
            </div>
          )}

          {/* Tổng số đơn */}
          <p className="text-center text-zinc-600 text-xs mt-3">
            Hiển thị {paginatedBookings.length} / {filteredBookings.length} đơn hàng
          </p>
        </>
      )}
    </div>
  );
};

export default MyOrders;