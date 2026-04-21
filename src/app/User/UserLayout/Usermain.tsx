import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useUserLayout } from './useUserLayout';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
// Import API cấu hình (bạn nhớ kiểm tra lại đường dẫn import cho đúng với project thực tế)
import { settingAPI } from '../../../common/api/adminAPI'; 

const UserLayout: React.FC = () => {
  const layoutProps = useUserLayout();
  const { isHomePage, chatOpen, setChatOpen } = layoutProps;
  
  // --- THÊM STATE KIỂM TRA BẢO TRÌ ---
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const res = await settingAPI.getSettings();
        setMaintenance(res.data.maintenanceMode);
      } catch (error) {
        console.error('Không thể kiểm tra trạng thái bảo trì:', error);
      } finally {
        setLoading(false);
      }
    };
    checkMaintenanceStatus();
  }, []);

  // 1. Màn hình chờ trong lúc gọi API kiểm tra bảo trì (Tránh bị nháy giao diện)
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
         <img src="/logo3.png" alt="Loading" className="w-32 animate-pulse mb-4 opacity-50" />
      </div>
    );
  }

  // 2. Màn hình bảo trì (Hiển thị nếu maintenanceMode = true)
  if (maintenance) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
        <img src="/logo3.png" alt="Boss Ticket Logo" className="w-48 mb-8" />
        <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4 tracking-wide">
          HỆ THỐNG ĐANG BẢO TRÌ
        </h1>
        <p className="text-lg text-zinc-400 max-w-lg mb-8">
          Boss Ticket hiện đang được nâng cấp để mang lại trải nghiệm đặt vé tốt nhất. 
          Vui lòng quay lại sau ít phút. Xin lỗi vì sự bất tiện này!
        </p>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }
  // -----------------------------------

  // 3. Giao diện bình thường khi không bảo trì
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      
      {/* Truyền toàn bộ props cần thiết vào Navbar */}
      <Navbar {...layoutProps} />

      {/* Khu vực render nội dung các Route */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Chân trang */}
      <Footer />

      {/* Nút Chatbot trôi nổi */}
      <FloatingChatbot 
        chatOpen={chatOpen} 
        toggleChat={() => setChatOpen(prev => !prev)} 
      />
      
    </div>
  );
};

export default UserLayout;