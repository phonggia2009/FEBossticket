import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Hướng dẫn khôi phục đã được gửi vào email của bạn.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-4">Quên mật khẩu?</h2>
        <p className="text-zinc-400 text-sm mb-6">Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" required placeholder="Email của bạn"
            className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-red-600"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={loading} className="w-full bg-red-600 py-3 rounded-xl font-bold text-white hover:bg-red-500 transition-all">
            {loading ? 'Đang gửi...' : 'GỬI YÊU CẦU'}
          </button>
          {message && <p className="text-emerald-400 text-xs text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
};
    export default ForgotPassword;