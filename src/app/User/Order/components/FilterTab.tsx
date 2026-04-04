import React, { useState, useRef, useEffect } from 'react';
import type { Booking, FilterType } from '../type';

interface Props {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  bookings: Booking[];
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'ALL',       label: 'Tất cả' },
  { key: 'SUCCESS',   label: 'Đã thanh toán' },
  { key: 'USED',      label: 'Đã sử dụng' },
  { key: 'PENDING',   label: 'Chờ thanh toán' },
  { key: 'EXPIRED',   label: 'Hết hạn' },
  { key: 'CANCELLED', label: 'Đã huỷ' },
];

export const FilterTabs: React.FC<Props> = ({ currentFilter, onFilterChange, bookings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý tự động đóng dropdown khi click chuột ra ngoài vùng chọn
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = FILTERS.find(f => f.key === currentFilter)?.label;

  return (
    <div className="relative mb-6 z-20 w-full md:w-64" ref={dropdownRef}>
      {/* Nút hiển thị trạng thái hiện tại */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm focus:outline-none"
      >
        <span>
          Trạng thái: <span className="text-red-500 ml-1 font-bold">{currentLabel}</span>
        </span>
        <svg 
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Danh sách thả xuống */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden py-1 origin-top animate-fadeIn">
          {FILTERS.map(f => {
            const count = f.key === 'ALL'
              ? bookings.length
              : bookings.filter(b => b.status === f.key).length;

            return (
              <button
                key={f.key}
                onClick={() => {
                  onFilterChange(f.key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors flex justify-between items-center focus:outline-none
                  ${currentFilter === f.key ? 'text-red-400 bg-zinc-800/60' : 'text-zinc-300'}
                `}
              >
                <span>{f.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold transition-colors ${
                  currentFilter === f.key 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};