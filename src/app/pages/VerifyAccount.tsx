import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Hoặc import axiosInstance của bạn

const VerifyAccount: React.FC = () => {
    const isCalled = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...');

  useEffect(() => {
  const verify = async () => {
    if (isCalled.current) return;

    const token = searchParams.get('token');
    if (!token) return;

    isCalled.current = true;

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.get(
        `${API_URL}/auth/verify-account`,
        {
          params: { token }
        }
      );

      if (response.status === 200) {
        setStatus('success');
        setMessage('Xác thực thành công! Đang chuyển hướng về trang đăng nhập...');

        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      }

    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
        'Liên kết xác thực không hợp lệ hoặc đã hết hạn.'
      );
    }
  };

  verify();
}, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center shadow-2xl">
        {/* Icon hiển thị theo trạng thái */}
        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Thông báo */}
        <h2 className={`text-xl font-black uppercase tracking-wider mb-2 ${
          status === 'error' ? 'text-red-500' : 'text-white'
        }`}>
          {status === 'loading' ? 'Vui lòng chờ' : status === 'success' ? 'Tuyệt vời!' : 'Rất tiếc!'}
        </h2>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
          {message}
        </p>

        {/* Nút quay lại nếu lỗi */}
        {status === 'error' && (
          <button 
            onClick={() => navigate('/login')}
            className="mt-8 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
          >
            QUAY LẠI ĐĂNG NHẬP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;