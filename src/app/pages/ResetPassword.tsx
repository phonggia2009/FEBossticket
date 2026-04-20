import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../common/api/axiosInstance';
import Preloader from '../../common/components/Preloader'; // Đảm bảo đúng đường dẫn tới Preloader của bạn

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State quản lý Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Kiểm tra khớp mật khẩu ở Client
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu (Ví dụ tối thiểu 6 ký tự)
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      return;
    }

    setLoading(true);

    try {
      // Gọi API đặt lại mật khẩu
      const response = await axiosInstance.post('/api/auth/reset-password', {
        token: searchParams.get('token'),
        newPassword: password
      });
      
      if (response.data.status === 'success' || response.status === 200) {
        showToast('Đổi mật khẩu thành công! Đang chuyển hướng...', 'success');
        
        // Chuyển hướng về Login sau khi hiện Toast
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err: any) {
      // Hiển thị lỗi từ Backend trả về
      const errorMsg = err.response?.data?.message || 'Link đã hết hạn hoặc không hợp lệ.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`fixed top-10 right-10 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border bg-zinc-900 transition-all animate-bounceIn ${
          toast.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}>
             {toast.type === 'success' ? '✓' : '✕'}
          </div>
          <p className="text-sm font-bold tracking-wide">{toast.msg}</p>
        </div>
      )}

      {/* Decorative Background (Giữ style đồng nhất với các trang Auth khác) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[120px]" />

      <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-red-900/40 rotate-3">
            <svg className="w-10 h-10 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Cài lại mật khẩu</h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium">Nhập mật khẩu mới an toàn hơn để tiếp tục đặt vé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Mật khẩu mới</label>
            <input 
              type="password" required 
              className="w-full bg-zinc-950/80 border border-zinc-800 text-white p-4 rounded-2xl outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-zinc-800"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Xác nhận mật khẩu</label>
            <input 
              type="password" required 
              className="w-full bg-zinc-950/80 border border-zinc-800 text-white p-4 rounded-2xl outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-zinc-800"
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-red-600 py-4 rounded-2xl font-black text-sm tracking-widest text-white hover:bg-red-500 active:scale-[0.98] transition-all shadow-lg shadow-red-900/20 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Preloader size="sm" />
                <span>ĐANG CẬP NHẬT...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                XÁC NHẬN THAY ĐỔI
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;