import React from 'react';

const TicketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const FilmIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const perks = [
  { icon: TicketIcon, text: 'Đặt vé online nhanh chóng' },
  { icon: StarIcon,   text: 'Tích điểm ưu đãi thành viên' },
  { icon: FilmIcon,   text: 'Xem lịch chiếu & trailer mới nhất' },
];

const RegisterBanner = () => (
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

    {/* Right edge accent */}
    <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-red-600 to-transparent" />

    {/* Content */}
    <div className="relative z-10 text-center px-12">
      <div className="w-16 h-16 bg-red-600 rounded-2xl -rotate-12 mx-auto mb-8 flex items-center justify-center shadow-lg shadow-red-900/50">
        <TicketIcon className="w-8 h-8 text-white rotate-12" />
      </div>

      <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
        Bắt đầu<br />
        <span className="text-red-500">ngay hôm nay</span>
      </h1>
      <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
        Tạo tài khoản và khám phá hàng trăm bộ phim đang chiếu
      </p>

      {/* Perks list */}
      <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
        {perks.map((perk, i) => {
          const Icon = perk.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-700/50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-zinc-400 text-sm">{perk.text}</span>
            </div>
          );
        })}
      </div>

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

export default RegisterBanner;