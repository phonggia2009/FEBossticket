// src/common/components/Preloader.tsx
import React from 'react';

interface PreloaderProps {
  fullScreen?: boolean; // Hiển thị toàn màn hình hay chỉ trong khung cha
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Preloader = ({ fullScreen = false, size = 'md', message }: PreloaderProps) => {
  // Xác định kích thước vòng quay
  const sizeClasses = {
    sm: 'h-6 w-6 border-t-2 border-b-2',
    md: 'h-12 w-12 border-t-4 border-b-4',
    lg: 'h-24 w-24 border-t-4 border-b-4',
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50 backdrop-blur-sm" 
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-indigo-500 animate-spin`}></div>
        {/* Nếu là bản lớn, hiện chữ AI Movie đặc trưng cho đồ án của bạn */}
        {size === 'lg' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600">
            AI MOVIE
          </div>
        )}
      </div>
      {message && <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">{message}</p>}
    </div>
  );
};

export default Preloader;