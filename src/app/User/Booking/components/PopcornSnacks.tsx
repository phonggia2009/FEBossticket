import React from 'react';
import type { Product, SelectedProduct } from '../types';

interface Props {
  products: Product[];
  selectedProducts: SelectedProduct[];
  onProductChange: (product: Product, quantity: number) => void;
  onBack: () => void;
}

const PopcornSnacks: React.FC<Props> = ({ products, selectedProducts, onProductChange, onBack }) => {
  return (
    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">Chọn Bắp Nước</h2>
          <p className="text-zinc-500 text-sm mt-1">Nạp năng lượng cho trải nghiệm điện ảnh tuyệt vời nhất</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => {
          // Lấy số lượng đã chọn (nếu có)
          const selected = selectedProducts.find(p => p.id === product.id);
          const quantity = selected ? selected.quantity : 0;

          return (
            <div key={product.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex gap-4 transition-all hover:border-zinc-700">
              {/* Ảnh minh họa (Dùng ảnh mặc định nếu không có API) */}
              <div className="w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700/50">
                <img 
                  src={product.image || `https://ui-avatars.com/api/?name=${product.name}&background=27272a&color=ef4444&size=100`} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Thông tin & Tăng giảm số lượng */}
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">{product.name}</h3>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description || 'Combo siêu tiết kiệm'}</p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-red-500 font-bold">{product.price.toLocaleString('vi-VN')} ₫</span>
                  
                  {/* Cụm nút +/- */}
                  <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
                    <button 
                      onClick={() => onProductChange(product, Math.max(0, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      disabled={quantity === 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="w-8 text-center text-white font-bold text-sm">{quantity}</span>
                    <button 
                      onClick={() => onProductChange(product, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopcornSnacks;