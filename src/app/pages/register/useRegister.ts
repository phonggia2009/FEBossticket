import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;

    const response = await axios.post(
      `${API_URL}/auth/register`,
      formData
    );

    if (response.data.code === 201 || response.data.status === 'success') {
      showToast('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.', 'success');

      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    }

  } catch (error: any) {
    showToast(error.response?.data?.message || 'Đăng ký thất bại', 'error');
  } finally {
    setLoading(false);
  }
};

  return {
    formData,
    loading,
    focused,
    setFocused,
    toast,
    handleChange,
    handleSubmit
  };
};