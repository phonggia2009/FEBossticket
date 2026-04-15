// src/app/Admin/pages/Point/PointManager.tsx
import { Card, Input } from 'antd';
import { usePointManager } from './usePointManager';
import PointHistoryTable from './components/PointHistoryTable';
import AdjustPointModal from './components/AdjustPointModal';

const { Search } = Input;

const PointManager = () => {
  const {
    histories, loading, currentPage, totalItems,
    modalOpen, setModalOpen, adjustLoading, selectedUser,
    handleSearchUserId, handleTableChange, openAdjustModal, handleAdjustPoints
  } = usePointManager();

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Lịch sử Biến động Điểm</h2>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Tìm theo User ID:</span>
            <Search 
              placeholder="Nhập ID khách hàng..." 
              allowClear 
              onSearch={handleSearchUserId} 
              style={{ width: 250 }} 
            />
          </div>
        </div>
      </Card>

      {/* Bảng dữ liệu */}
      <PointHistoryTable 
        dataSource={histories} 
        loading={loading} 
        currentPage={currentPage}
        totalItems={totalItems}
        onTableChange={handleTableChange}
        onAdjustClick={openAdjustModal}
      />

      {/* Modal Cộng/Trừ Điểm */}
      <AdjustPointModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdjustPoints}
        loading={adjustLoading}
        user={selectedUser}
      />
    </div>
  );
};

export default PointManager;