import React, { useState, useEffect } from 'react';
import { getMe, updateProfile } from '../../../common/api/userAPI';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', email: '' });
  const [points, setPoints] = useState(0);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getMe()
      .then(res => {
        const user = res.data?.data?.user;
        if (user) {
          setFormData({ 
            fullName: user.fullName || '', 
            phoneNumber: user.phoneNumber || '',
            email: user.email || '' ,// Email chỉ để hiển thị, không cho sửa
          });
          setPoints(user.points || 0);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({ fullName: formData.fullName, phoneNumber: formData.phoneNumber });
      showToast('Cập nhật thông tin thành công!', 'success');
      
      // Nếu bạn có dùng Redux lưu thông tin user, bạn nên dispatch action update ở đây
      
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Lỗi cập nhật', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-zinc-400">Đang tải...</div>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4 relative">
      {/* Toast Thông báo */}
      {toast && (
        <div className={`fixed top-24 right-5 z-50 px-5 py-3 rounded-xl shadow-lg border bg-zinc-900 ${
          toast.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 'border-red-500/50 text-red-400'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-6 uppercase">Thông tin cá nhân</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (Disabled) */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">Email (Không thể thay đổi)</label>
            <input 
              type="email" 
              value={formData.email} 
              disabled 
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-xl px-4 py-3 cursor-not-allowed"
            />
          </div>

          {/* Họ và Tên */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">Họ và Tên</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="Nhập họ và tên..."
              required
              className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">Số điện thoại</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber} 
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-6 flex justify-between items-center">
            <div>
              <p className="text-zinc-400 text-sm font-bold mb-1">Điểm tích lũy hiện tại</p>
              <p className="text-3xl font-black text-yellow-500">{points.toLocaleString('vi-VN')} <span className="text-lg">Điểm</span></p>
            </div>
            <div className="w-14 h-14 bg-yellow-500/20 flex justify-center items-center rounded-full">
              <span className="text-yellow-500 text-2xl">⭐</span>
            </div>
        </div>

          {/* Nút Submit */}
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;