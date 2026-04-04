import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../../store';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);
  const isVerifiedSuccess = searchParams.get('verified') === 'true';

  useEffect(() => {
    if (token) {
      if (user?.role === 'ADMIN') navigate('/admin/showtimes');
      else navigate('/');
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      const loggedUser = result.payload.user; 
      if (loggedUser?.role === 'ADMIN') navigate('/admin/showtimes');
      else navigate('/');
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    focused, setFocused,
    loading, error,
    isVerifiedSuccess,
    handleSubmit
  };
};