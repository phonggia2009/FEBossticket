// File: Booking/PaymentResults.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Result, Spin } from 'antd';
import { fetchCurrentUser } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useDispatch<any>();
  const user = useSelector((state: any) => state.auth.user);

  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  const bookingId = searchParams.get('bookingId');
  const paymentStatus = searchParams.get('status');

  useEffect(() => {
    if (paymentStatus === 'success') {
      setStatus('success');
      dispatch(fetchCurrentUser()).then((action: any) => {
        const newUser = action.payload;
        const oldPoints = user?.points || 0;
        const newPoints = newUser?.points || 0;
        const earned = newPoints - oldPoints;
        if (earned > 0) {
          setPointsEarned(earned);
        }
      });
    } else {
      setStatus('error');
    }
  }, [paymentStatus]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 py-12 px-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center">

        {status === 'success' ? (
          <>
            <Result
              status="success"
              title={
                <span className="text-white text-2xl font-black uppercase">
                  Thanh toán thành công!
                </span>
              }
              subTitle={
                <span className="text-zinc-400">
                  Cảm ơn bạn đã đặt vé. Mã đơn hàng của bạn là:{' '}
                  <strong className="text-white">#{bookingId}</strong>
                </span>
              }
              extra={[
                <Button
                  key="tickets"
                  onClick={() => navigate('/my-bookings')}
                  className="bg-red-600 text-white border-none hover:bg-red-500 h-11 px-8 font-bold rounded-lg shadow-lg shadow-red-900/50"
                >
                  XEM VÉ CỦA TÔI
                </Button>,
                <Button
                  key="home"
                  onClick={() => navigate('/')}
                  type="link"
                  className="text-zinc-400 hover:text-white mt-4 block w-full"
                >
                  Về trang chủ
                </Button>,
              ]}
            />

            {/* ✅ Hiển thị điểm vừa tích được nếu có */}
            {pointsEarned > 0 && (
              <div className="mt-4 flex items-center justify-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-4 animate-fade-in">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⭐</span>
                </div>
                <div className="text-left">
                  <p className="text-yellow-400 font-black text-lg">
                    +{pointsEarned.toLocaleString('vi-VN')} điểm
                  </p>
                  <p className="text-zinc-400 text-xs">
                    Đã được cộng vào tài khoản của bạn
                  </p>
                </div>
              </div>
            )}

            {/* Tổng điểm hiện tại sau khi cộng */}
            {user?.points != null && (
              <p className="mt-3 text-zinc-500 text-sm">
                Tổng điểm hiện tại:{' '}
                <span className="text-yellow-500 font-bold">
                  {(user.points).toLocaleString('vi-VN')} điểm
                </span>
              </p>
            )}
          </>
        ) : (
          <Result
            status="error"
            title={
              <span className="text-white text-2xl font-black uppercase">
                Thanh toán thất bại!
              </span>
            }
            subTitle={
              <span className="text-zinc-400">
                {paymentStatus === 'already_processed'
                  ? 'Giao dịch này đã được xử lý trước đó.'
                  : 'Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.'}
              </span>
            }
            extra={[
              <Button
                key="home"
                onClick={() => navigate('/')}
                className="bg-zinc-800 text-white border-none hover:bg-zinc-700 h-11 px-8 font-bold rounded-lg mt-4"
              >
                VỀ TRANG CHỦ
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentResult;