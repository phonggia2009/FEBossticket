import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import LoginBanner from '../login/components/LoginBanner';
import LoginForm from '../login/components/LoginForm';
import RegisterBanner from '../register/components/RegisterBanner';
import RegisterForm from '../register/components/RegisterForm';
import { loginUser } from '../../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../../store';
const DURATION = 0.45;
const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];

// ── Direction-aware variants ──────────────────────────────────────────
// dir =  1 → đang đi tới register (trượt từ phải vào, ra trái)
// dir = -1 → đang đi tới login    (trượt từ trái vào, ra phải)
const makeVariants = (dir: number) => ({
  initial: {
    opacity: 0,
    x: dir * 40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION, ease: EASE },
  },
  exit: {
    opacity: 0,
    x: dir * -40,
    transition: { duration: 0.25, ease: EASE },
  },
});

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin  = location.pathname === '/login';

  // Theo dõi route trước để xác định hướng trượt
  const prevIsLogin = useRef<boolean>(isLogin);
  // dir = 1: login→register (trượt trái), dir = -1: register→login (trượt phải)
  const dir = isLogin ? -1 : 1;
  useEffect(() => { prevIsLogin.current = isLogin; }, [isLogin]);

  const variants = makeVariants(dir);

  // ── Login state ───────────────────────────────────────────────────
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [loginFocused, setLoginFocused] = useState<string | null>(null);
  const [searchParams]                  = useSearchParams();
  const isVerifiedSuccess               = searchParams.get('verified') === 'true';

  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading: loginLoading, error: loginError } =
    useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      if (user?.role === 'ADMIN') navigate('/admin/showtimes');
      else navigate('/');
    }
  }, [token, user, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const loggedUser = result.payload.user;
      if (loggedUser?.role === 'ADMIN') navigate('/admin/showtimes');
      else navigate('/');
    }
  };

  // ── Register state ────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phoneNumber: '',
  });
  const [registerFocused, setRegisterFocused] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [toast, setToast]                     = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const { error: registerError }              = useSelector((state: RootState) => state.auth);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setRegisterLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (res.data.code === 201 || res.data.status === 'success') {
        showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.', 'success');
        setTimeout(() => navigate('/login?registered=true'), 2000);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Đăng ký thất bại', 'error');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">

      {/* ── LEFT PANEL ───────────────────────────────────────────────
          Login    → LoginBanner   (vào từ trái khi quay lại login)
          Register → RegisterForm  (vào từ phải khi sang register)
      ─────────────────────────────────────────────────────────────── */}
      <div className="w-1/2 min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {isLogin ? (
            <motion.div
              key="login-banner"
              className="absolute inset-0"
              custom={dir}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LoginBanner />
            </motion.div>
          ) : (
            <motion.div
              key="register-form"
              className="absolute inset-0 overflow-y-auto"
              custom={dir}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RegisterForm
                handleSubmit={handleRegisterSubmit}
                handleChange={handleChange}
                loading={registerLoading}
                focused={registerFocused}
                setFocused={setRegisterFocused}
                error={registerError}
                toast={toast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 self-stretch"
        style={{
          width: '1px',
          background:
            'linear-gradient(to bottom, transparent, #dc262650 20%, #dc2626 50%, #dc262650 80%, transparent)',
        }}
      />

      {/* ── RIGHT PANEL ──────────────────────────────────────────────
          Login    → LoginForm     (vào từ trái khi quay lại login)
          Register → RegisterBanner (vào từ phải khi sang register)
      ─────────────────────────────────────────────────────────────── */}
      <div className="w-1/2 min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {isLogin ? (
            <motion.div
              key="login-form"
              className="absolute inset-0 overflow-y-auto"
              custom={dir}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LoginForm
                email={email}
                setEmail={setEmail}
                setPassword={setPassword}
                focused={loginFocused}
                setFocused={setLoginFocused}
                handleSubmit={handleLoginSubmit}
                loading={loginLoading}
                error={loginError}
                isVerifiedSuccess={isVerifiedSuccess}
              />
            </motion.div>
          ) : (
            <motion.div
              key="register-banner"
              className="absolute inset-0"
              custom={dir}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RegisterBanner />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default AuthLayout;