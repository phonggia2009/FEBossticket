import React, { useEffect, useState } from 'react';
import { Spin, Pagination } from 'antd';
import { getActiveVouchers } from '../../../common/api/userAPI';
import VoucherCard, { type Voucher } from './components/VoucherCard';

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchVouchers(currentPage);
  }, [currentPage]);

  const fetchVouchers = async (page: number) => {
    setLoading(true);
    try {
      const res = await getActiveVouchers();

      const data = res.data?.data || [];
      setVouchers(data);

      const pagination = res.data?.pagination;
      if (pagination) {
        setTotalItems(pagination.totalItems);
      }
    } catch (error) {
      console.error("Lỗi lấy voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header giống NowShowing */}
      <div className="mb-8 border-l-4 border-green-600 pl-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">
          Voucher <span className="text-green-500">Đang Hoạt Động</span>
        </h1>
        <p className="text-zinc-500 mt-2">
          Nhận ngay ưu đãi hấp dẫn từ hệ thống
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : vouchers.length > 0 ? (
        <>
          {/* Grid giống phim */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {vouchers.map(v => (
              <VoucherCard key={v.id} voucher={v} />
            ))}
          </div>

          {/* Pagination giữ nguyên */}
          {totalItems > pageSize && (
            <div className="mt-12 flex justify-center">
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="custom-dark-pagination"
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-lg">
            Hiện tại chưa có voucher nào.
          </p>
        </div>
      )}
    </div>
  );
};

export default VoucherList;