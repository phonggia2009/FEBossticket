import React, { useEffect, useState } from 'react';
import { getActiveVouchers } from '../../../../common/api/userAPI';

// Định nghĩa interface dựa trên cấu trúc trả về từ API
interface Voucher {
  id: number;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  expiration_date?: string | null;
  end_date?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  tag?: string | null;
}

const PromotionSection: React.FC = () => {
  const [promotions, setPromotions] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await getActiveVouchers();
        // Dữ liệu trả về thường nằm trong response.data.data (nếu dùng utils/responseHelper.js)
        const activeVouchers = response.data?.data || response.data || [];
        setPromotions(activeVouchers);
      } catch (error) {
        console.error('Lỗi khi tải danh sách khuyến mãi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-16">Đang tải chương trình khuyến mãi...</div>;
  }

  if (promotions.length === 0) {
    return null; // Ẩn section nếu không có voucher nào đang hoạt động
  }

  return (
    <section className="w-full bg-[#0a0a0a] py-16 px-8 md:px-16 lg:px-24">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-2 border-l-4 border-[#E53935] pl-4">
            Khuyến Mãi & Sự Kiện
          </h2>
          <p className="text-gray-400 text-sm md:text-base pl-5">
            Săn vé giá rẻ, nhận ngàn ưu đãi từ hệ thống rạp của chúng tôi
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
          Xem tất cả
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grid Promotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {promotions.map((promo) => {
          // Xử lý logic hiển thị — normalize backend values
          const isPercent = promo.discount_type === 'PERCENTAGE'; // Cập nhật so sánh thành PERCENTAGE
          const title = promo.title || (isPercent 
            ? `Giảm ${promo.discount_value}% Cho Đơn Hàng` 
            : `Giảm ${promo.discount_value.toLocaleString('vi-VN')}đ Cho Đơn Hàng`);
          const tag = promo.tag || (isPercent ? `Giảm ${promo.discount_value}%` : `Giảm ${promo.discount_value.toLocaleString('vi-VN')}đ`);
          // Prefer `end_date`, fallback to `expiration_date`, validate before formatting
          const rawEnd = (promo as any).end_date ?? promo.expiration_date ?? null;
          const validEnd = rawEnd && !Number.isNaN(Date.parse(rawEnd)) ? rawEnd : null;
          const formattedDate = validEnd ? new Date(validEnd).toLocaleDateString('vi-VN') : '—';
          const imageUrl = promo.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';

          return (
            <div 
              key={promo.id} 
              className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(229,57,53,0.15)]"
            >
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10" />
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 z-20 bg-[#E53935] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 relative z-20 -mt-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[#E53935] transition-colors">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {promo.description || 'Nhanh tay sử dụng mã giảm giá này cho lượt đặt vé tiếp theo của bạn!'}
                </p>

                {/* Bottom Action Area */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mã Voucher</span>
                    <span className="text-white font-mono font-bold tracking-widest">{promo.code}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigator.clipboard.writeText(promo.code)}
                    className="bg-white/10 hover:bg-[#E53935] text-white p-2.5 rounded-lg transition-colors duration-300 group/btn relative"
                    title="Copy mã"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Copy mã
                    </span>
                  </button>
                </div>
                
                <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hạn sử dụng: {formattedDate}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Nút xem tất cả cho Mobile */}
      <button className="md:hidden w-full mt-8 border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium">
        Xem tất cả chương trình
      </button>
    </section>
  );
};

export default PromotionSection;