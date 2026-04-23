import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../../../store/slices/authSlice';
import { useCallback } from 'react';
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

const handleGoogleSuccess = useCallback(async (credentialResponse: any) => {
  console.log('[GoogleSuccess] called');
  console.log('[GoogleSuccess] response:', credentialResponse);

  if (!credentialResponse?.credential) {
    console.log('[GoogleSuccess] NO credential');
    return;
  }

  console.log('[GoogleSuccess] credential exists');

  const result = await dispatch(loginWithGoogle(credentialResponse.credential));

  console.log('[GoogleSuccess] dispatch result:', result);

  if (loginWithGoogle.fulfilled.match(result)) {
    console.log('[GoogleSuccess] login success');

    const loggedUser = result.payload.user;

    if (loggedUser?.role === 'ADMIN') {
      console.log('[GoogleSuccess] navigate admin');
      navigate('/admin/showtimes');
    } else {
      console.log('[GoogleSuccess] navigate home');
      navigate('/');
    }
  } else {
    console.log('[GoogleSuccess] login failed');
  }
}, [dispatch, navigate]);

  return {
    email, setEmail,
    password, setPassword,
    focused, setFocused,
    loading, error,
    isVerifiedSuccess,
    handleSubmit,
    handleGoogleSuccess
  };
};