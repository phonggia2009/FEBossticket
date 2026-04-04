import React from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../../../../common/components/Preloader';

// ── Icons ─────────────────────────────────────────────────────────────
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
    <path fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd" />
  </svg>
);
// ──────────────────────────────────────────────────────────────────────

const fields = [
  { name: 'fullName',     label: 'Họ và Tên',       type: 'text',     placeholder: 'Nguyễn Văn A',   icon: UserIcon  },
  { name: 'email',        label: 'Email',             type: 'email',    placeholder: 'ten@email.com',  icon: EmailIcon },
  { name: 'phoneNumber',  label: 'Số điện thoại',    type: 'text',     placeholder: '0912 345 678',   icon: PhoneIcon },
  { name: 'password',     label: 'Mật khẩu',          type: 'password', placeholder: '••••••••',       icon: LockIcon  },
];

interface Props {
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  focused: string | null;
  setFocused: (val: string | null) => void;
  error?: string | null;
  toast: { msg: string; type: 'success' | 'error' } | null;
}

const RegisterForm: React.FC<Props> = ({
  handleSubmit, handleChange,
  loading, focused, setFocused,
  error, toast,
}) => {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center p-6 sm:p-12 bg-zinc-950">

      {/* Toast notification */}
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

        {/* Error from Redux */}
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
                <label
                  className={`block text-xs font-bold tracking-widest uppercase mb-2 transition-colors duration-200 ${
                    focused === field.name ? 'text-red-400' : 'text-zinc-500'
                  }`}
                >
                  {field.label}
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    focused === field.name
                      ? 'border-red-600 bg-zinc-900 shadow-lg shadow-red-950/30'
                      : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 absolute left-4 transition-colors duration-200 ${
                      focused === field.name ? 'text-red-500' : 'text-zinc-600'
                    }`}
                  />
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
                Đăng ký &amp; Vào rạp
                <ArrowIcon className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-8 pt-8 border-t border-zinc-800/60 text-center">
          <p className="text-sm text-zinc-500">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-bold text-red-500 hover:text-red-400 transition-colors underline underline-offset-4 decoration-red-800 hover:decoration-red-500"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterForm;