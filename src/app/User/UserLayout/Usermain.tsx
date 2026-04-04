import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserLayout } from './useUserLayout';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
import SuggestedVideos from '../SuggestedVideos'; // Cập nhật đúng đường dẫn

const UserLayout: React.FC = () => {
  const layoutProps = useUserLayout();
  const { isHomePage, chatOpen, setChatOpen } = layoutProps;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      
      {/* Truyền toàn bộ props cần thiết vào Navbar */}
      <Navbar {...layoutProps} />

      {/* Hiển thị video gợi ý nếu ở trang chủ */}

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