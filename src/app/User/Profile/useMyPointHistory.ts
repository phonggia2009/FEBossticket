import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getMyPointHistory } from '../../../common/api/userAPI'; // Thay đổi đường dẫn cho đúng

export interface PointHistory {
  id: number;
  change_amount: number;
  balance_after: number;
  reason: string;
  createdAt: string;
}

export const useMyPointHistory = () => {
  const [histories, setHistories] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchHistories = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getMyPointHistory(page, 10);
      // Chú ý: Backend của bạn trả về biến tên là 'history'
      setHistories(res.data.data.history); 
      setTotalItems(res.data.data.pagination.totalItems);
      setCurrentPage(page);
    } catch (error) {
      message.error('Không thể tải lịch sử điểm. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistories(1);
  }, [fetchHistories]);

  const handleTableChange = (pagination: any) => {
    fetchHistories(pagination.current);
  };

  return { histories, loading, currentPage, totalItems, handleTableChange };
};