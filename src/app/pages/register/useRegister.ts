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

    // Log ra để kiểm tra chính xác dữ liệu trước khi gửi
    console.log("Dữ liệu gửi đi:", formData);

    const response = await axios.post(
      `${API_URL}/auth/register`,
      {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 201 || response.data.status === 'success') {
      showToast('Đăng ký thành công!', 'success');
      setTimeout(() => navigate('/login?registered=true'), 2000);
    }
  } catch (error: any) {
    // In ra chi tiết lỗi từ server để debug
    console.error("Lỗi chi tiết:", error.response?.data);
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