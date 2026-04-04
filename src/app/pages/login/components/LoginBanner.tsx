import React from 'react';

const FilmIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const LoginBanner = () => (
  // ✅ w-full h-full thay vì hidden lg:flex lg:w-1/2 — AuthLayout đã kiểm soát width
  <div className="flex w-full h-full min-h-screen relative overflow-hidden bg-black items-center justify-center">

    {/* Grid background */}
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, #dc2626 39px, #dc2626 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, #dc2626 39px, #dc2626 40px)
        `,
      }}
    />

    {/* Decorative circles */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-red-900 opacity-20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-red-800 opacity-30" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-red-700 opacity-10" />

    {/* Left edge accent */}
    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-red-600 to-transparent" />

    {/* Content */}
    <div className="relative z-10 text-center px-12">
      <div className="w-16 h-16 bg-red-600 rounded-2xl rotate-12 mx-auto mb-8 flex items-center justify-center shadow-lg shadow-red-900/50">
        <FilmIcon className="w-8 h-8 text-white -rotate-12" />
      </div>

      <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
        Chào mừng đến với<br />
        <span className="text-red-500">BOSSTICKET</span>
      </h1>
      <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
        Đăng nhập để đặt vé, chọn ghế và tận hưởng bộ phim yêu thích
      </p>

      {/* Cinema screen decoration */}
      <div className="flex items-end justify-center gap-1.5 mt-10">
        {[3, 4, 5, 5, 4, 3].map((h, i) => (
          <div
            key={i}
            className="w-5 rounded-t-md bg-red-900/50 border border-red-800/60"
            style={{ height: `${h * 6}px` }}
          />
        ))}
      </div>
      <div className="mt-2 mx-auto w-40 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full" />
      <p className="text-zinc-700 text-xs mt-1 tracking-widest uppercase">Màn hình</p>
    </div>
  </div>
);

export default LoginBanner;