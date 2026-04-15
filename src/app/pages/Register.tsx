import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Bổ sung axios
import { registerUser } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store';
import Preloader from '../../common/components/Preloader';

// ── Cinema icons ─────────────────────────────────────────────────────
const FilmIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const TicketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Bổ sung state loading
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null); // Bổ sung state toast

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;

    const response = await axios.post(
      `${API_URL}/auth/register`,
      formData
    );

    if (response.data.code === 201 || response.data.status === 'success') {
      showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.', 'success');

      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    }

  } catch (error: any) {
    showToast(error.response?.data?.message || 'Đăng ký thất bại', 'error');
  } finally {
    setLoading(false);
  }
};

  const fields = [
    {
      name: 'fullName',
      label: 'Họ và Tên',
      type: 'text',
      placeholder: 'Nguyễn Văn A',
      icon: UserIcon,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'ten@email.com',
      icon: EmailIcon,
    },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'text',
      placeholder: '0912 345 678',
      icon: PhoneIcon,
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      type: 'password',
      placeholder: '••••••••',
      icon: LockIcon,
    },
  ];

  const perks = [
    { icon: TicketIcon, text: 'Đặt vé online nhanh chóng' },
    { icon: StarIcon,   text: 'Tích điểm ưu đãi thành viên' },
    { icon: FilmIcon,   text: 'Xem lịch chiếu & trailer mới nhất' },
  ];

  return (
    <div className="flex min-h-screen bg-black relative">
      
      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`fixed top-10 right-10 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border bg-zinc-900 transition-all animate-fadeIn ${
          toast.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}>
             {toast.type === 'success' ? '✓' : '✕'}
          </div>
          <p className="text-sm font-bold">{toast.msg}</p>
        </div>
      )}

      {/* ── Left Panel – Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-zinc-950">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-red-600 rounded-xl rotate-6 flex items-center justify-center">
              <FilmIcon className="w-5 h-5 text-white -rotate-6" />
            </div>
            <span className="text-white font-black text-xl tracking-wide">CINESTAR</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TicketIcon className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-xs font-bold tracking-widest uppercase">Tạo tài khoản</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Đăng Ký</h2>
            <p className="text-zinc-500 text-sm mt-2">Điền đầy đủ thông tin để bắt đầu đặt vé ngay</p>
          </div>

          {/* Error from Redux (nếu có) */}
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 bg-red-950/60 border border-red-800/60 rounded-xl">
              <AlertIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.name}>
                  <label className={`block text-xs font-bold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === field.name ? 'text-red-400' : 'text-zinc-500'}`}>
                    {field.label}
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${focused === field.name ? 'border-red-600 bg-zinc-900 shadow-lg shadow-red-950/30' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <Icon className={`w-4 h-4 absolute left-4 transition-colors duration-200 ${focused === field.name ? 'text-red-500' : 'text-zinc-600'}`} />
                    <input
                      name={field.name}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white text-sm placeholder-zinc-700 outline-none rounded-xl"
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused(null)}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              );
            })}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 font-black text-sm tracking-widest uppercase text-white bg-red-600 rounded-xl hover:bg-red-500 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-red-900/40 hover:shadow-red-900/60 hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Preloader size="sm" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <TicketIcon className="w-4 h-4" />
                  Đăng ký & Vào rạp
                  <ArrowIcon className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 pt-8 border-t border-zinc-800/60 text-center">
            <p className="text-sm text-zinc-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-red-500 hover:text-red-400 transition-colors underline underline-offset-4 decoration-red-800 hover:decoration-red-500">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel – Decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black items-center justify-center">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, #dc2626 39px, #dc2626 40px),
                              repeating-linear-gradient(90deg, transparent, transparent 39px, #dc2626 39px, #dc2626 40px)`
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-red-900 opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-red-800 opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-red-700 opacity-10" />
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-red-600 to-transparent" />

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

          {/* Decorative seat row */}
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
    </div>
  );
};

export default Register;