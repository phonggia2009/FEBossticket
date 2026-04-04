import React from 'react';
import { XIcon } from './Icon';
import ChatbotUI from '../../Chatbot/Chatbot'; // Sửa lại đường dẫn nếu cần thiết

interface Props {
  chatOpen: boolean;
  toggleChat: () => void;
}

const FloatingChatbot: React.FC<Props> = ({ chatOpen, toggleChat }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {chatOpen && (
        <div className="animate-fade-in-up">
          <ChatbotUI />
        </div>
      )}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-900/50 flex items-center justify-center transition-all duration-200 hover:-translate-y-1"
        aria-label="Mở chatbot"
      >
        {chatOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingChatbot;