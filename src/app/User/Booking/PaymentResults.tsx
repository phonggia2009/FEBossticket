// File: Booking/PaymentResults.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Result, Spin } from 'antd';
import { fetchCurrentUser } from '../../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');

  useEffect(() => {
    // Đọc tham số 'status' từ URL do Backend của bạn redirect về
    const paymentStatus = searchParams.get('status');
     const dispatch = useDispatch<any>();
    if (paymentStatus === 'success') {
      dispatch(fetchCurrentUser()); 
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><Spin size="large" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 py-12 px-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center">
        {status === 'success' ? (
          <Result
            status="success"
            title={<span className="text-white text-2xl font-black uppercase">Thanh toán thành công!</span>}
            subTitle={<span className="text-zinc-400">Cảm ơn bạn đã đặt vé. Mã giao dịch của bạn là: <strong className="text-white">{searchParams.get('bookingId')}</strong></span>}
            extra={[
              <Button key="console" onClick={() => navigate('/my-bookings')} className="bg-red-600 text-white border-none hover:bg-red-500 h-11 px-8 font-bold rounded-lg shadow-lg shadow-red-900/50">
                XEM VÉ CỦA TÔI
              </Button>,
              <Button key="buy" onClick={() => navigate('/')} type="link" className="text-zinc-400 hover:text-white mt-4 block w-full">
                Về trang chủ
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title={<span className="text-white text-2xl font-black uppercase">Thanh toán thất bại!</span>}
            subTitle={
              <span className="text-zinc-400">
                {searchParams.get('status') === 'already_processed' 
                  ? 'Giao dịch này đã được xử lý trước đó.' 
                  : 'Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.'}
              </span>
            }
            extra={[
              <Button key="home" onClick={() => navigate('/')} className="bg-zinc-800 text-white border-none hover:bg-zinc-700 h-11 px-8 font-bold rounded-lg mt-4">
                VỀ TRANG CHỦ
              </Button>
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentResult;