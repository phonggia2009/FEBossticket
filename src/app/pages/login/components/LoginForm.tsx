import React from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../../../../common/components/Preloader';

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

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
// ──────────────────────────────────────────────────────────────────────

interface Props {
  email: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  focused: string | null;
  setFocused: (val: string | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  isVerifiedSuccess: boolean;
}

const LoginForm: React.FC<Props> = ({
  email, setEmail, setPassword,
  focused, setFocused,
  handleSubmit, loading, error, isVerifiedSuccess,
}) => {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center p-6 sm:p-12 bg-zinc-950">
      <div className="w-full max-w-md">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-red-600 rounded-xl rotate-6 flex items-center justify-center">
            <FilmIcon className="w-5 h-5 text-white -rotate-6" />
          </div>
          <span className="text-white font-black text-xl tracking-wide">CINESTAR</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <TicketIcon className="w-4 h-4 text-red-500" />
            <span className="text-red-500 text-xs font-bold tracking-widest uppercase">
              BOSS<span className="text-white">TICKET</span>
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Đăng Nhập</h2>
          <p className="text-zinc-500 text-sm mt-2">Đăng nhập để đặt vé &amp; quản lý lịch chiếu của bạn</p>
        </div>

        {/* Verification success alert */}
        {isVerifiedSuccess && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-emerald-950/60 border border-emerald-800/60 rounded-xl animate-pulse">
            <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-300 text-sm font-bold">
              Tài khoản đã được kích hoạt thành công! Hãy đăng nhập để tiếp tục.
            </p>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-950/60 border border-red-800/60 rounded-xl">
            <AlertIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">
              {error === 'ACCOUNT_NOT_VERIFIED'
                ? 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn để kích hoạt.'
                : error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              className={`block text-xs font-bold tracking-widest uppercase mb-2 transition-colors duration-200 ${
                focused === 'email' ? 'text-red-400' : 'text-zinc-500'
              }`}
            >
              Email tài khoản
            </label>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                focused === 'email'
                  ? 'border-red-600 bg-zinc-900 shadow-lg shadow-red-950/30'
                  : 'border-zinc-800 bg-zinc-900/60'
              }`}
            >
              <EmailIcon
                className={`w-4 h-4 absolute left-4 transition-colors duration-200 ${
                  focused === 'email' ? 'text-red-500' : 'text-zinc-600'
                }`}
              />
              <input
                type="email"
                required
                value={email}
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white text-sm placeholder-zinc-700 outline-none rounded-xl"
                placeholder="ten@email.com"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`block text-xs font-bold tracking-widest uppercase transition-colors duration-200 ${
                  focused === 'password' ? 'text-red-400' : 'text-zinc-500'
                }`}
              >
                Mật khẩu
              </label>
              <a
                href="/forgot-password"
                className="text-xs text-red-600 hover:text-red-400 transition-colors font-medium"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                focused === 'password'
                  ? 'border-red-600 bg-zinc-900 shadow-lg shadow-red-950/30'
                  : 'border-zinc-800 bg-zinc-900/60'
              }`}
            >
              <LockIcon
                className={`w-4 h-4 absolute left-4 transition-colors duration-200 ${
                  focused === 'password' ? 'text-red-500' : 'text-zinc-600'
                }`}
              />
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white text-sm placeholder-zinc-700 outline-none rounded-xl"
                placeholder="••••••••"
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

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
                Vào rạp ngay
                <ArrowIcon className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-8 pt-8 border-t border-zinc-800/60 text-center">
          <p className="text-sm text-zinc-500">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="font-bold text-red-500 hover:text-red-400 transition-colors underline underline-offset-4 decoration-red-800 hover:decoration-red-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;