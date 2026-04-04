import { useState, useRef, useEffect } from 'react';
// CHÚ Ý: Đảm bảo đường dẫn import API chính xác với dự án của bạn
import { sendChatMessage } from '../../../common/api/userAPI'; 
import type { Message } from './type';

const getTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const QUICK_REPLIES = ['Phim đang chiếu', 'Suất chiếu hôm nay', 'Hướng dẫn đặt vé', 'Danh sách rạp'];

export const useChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      sender: 'bot',
      text: '👋 Xin chào! Tôi là trợ lý của BOSSTIKET.\nTôi có thể giúp bạn:\n  • Xem phim đang chiếu\n  • Tra suất chiếu theo tên phim\n  • Hướng dẫn đặt vé\n  • Xem danh sách rạp',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Tự động focus vào input khi mở Chatbot
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Hàm gửi tin nhắn
  const sendMessage = async (text: string) => {
    if (!text.trim() || text.length > 300 || loading) return;
    
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text, time: getTime() }]);
    setLoading(true);
    
    try {
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      const res = await sendChatMessage(text, history);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: res.data.reply, time: getTime() }]);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Lỗi kết nối, vui lòng thử lại.';
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: errMsg, time: getTime() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(input); 
    }
  };

  return {
    open, setOpen,
    messages,
    input, setInput,
    loading,
    endRef, inputRef,
    sendMessage, handleKeyDown
  };
};