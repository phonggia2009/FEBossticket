import React from 'react';
import dayjs from 'dayjs';
import { useMyPointHistory } from '../useMyPointHistory';

const MyPointHistory = () => {
  const { histories, loading, currentPage, totalItems, handleTableChange } = useMyPointHistory();

  const totalPages = Math.ceil(totalItems / 10) || 1; 

  const goToPage = (page: number) => {
    handleTableChange({ current: page });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="py-8 text-zinc-500 animate-pulse font-medium">Đang tải lịch sử điểm...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-2xl font-black text-white mb-6 uppercase">Lịch sử sử dụng điểm</h2>
      
      {histories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center py-8 text-zinc-500 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
          Bạn chưa có giao dịch điểm nào.
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {histories.map((item) => {
            const isPositive = item.change_amount > 0;
            return (
              <div 
                key={item.id} 
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex justify-between items-center hover:border-zinc-700 transition-colors"
              >
                <div className="pr-4">
                  <p className="text-sm text-zinc-300 font-bold mb-1 line-clamp-2">
                    {item.reason}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {dayjs(item.createdAt).format('HH:mm - DD/MM/YYYY')}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className={`text-lg font-black ${isPositive ? 'text-yellow-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{item.change_amount}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Số dư: <span className="text-zinc-300 font-medium">{item.balance_after}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
          <button 
            type="button" 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trang trước
          </button>
          
          <span className="text-sm text-zinc-500 font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          
          <button 
            type="button" 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPointHistory;