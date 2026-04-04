import React from 'react';
import { useChatbot, QUICK_REPLIES } from './useChatbot';
import { FilmIcon } from './components/Icon';
import { MessageText } from './components/MessageText';
import { TypingIndicator } from './components/TypingIndicator';

const ChatbotUI: React.FC = () => {
  const {
    open, setOpen,
    messages,
    input, setInput,
    loading,
    endRef, inputRef,
    sendMessage, handleKeyDown
  } = useChatbot();

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        .animate-slide-up   { animation: slideUp   0.3s cubic-bezier(0.34,1.4,0.64,1) both; }
        .animate-fade-msg   { animation: fadeInMsg 0.22s ease both; }
        .animate-pulse-ring { animation: pulseRing 2s ease-out infinite; }

        .chat-scroll::-webkit-scrollbar       { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(239,68,68,0.4); }
      `}</style>

      {/* CHÚ Ý: Component không bọc thẻ bọc ngoài cùng (wrapper trôi nổi), 
          vì thẻ trôi nổi đã được bạn cấu hình trong UserLayout.tsx */}
      
      {/* ── Chat Window ── */}
      {open && (
        <div className="animate-slide-up w-[350px] h-[530px] rounded-2xl flex flex-col overflow-hidden bg-neutral-950 border border-red-500/20 shadow-[0_24px_60px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.05)]">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 bg-gradient-to-r from-neutral-900 to-neutral-950 border-b border-red-500/15">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-red-500 to-red-900 shadow-[0_4px_14px_rgba(239,68,68,0.35)]">
              <FilmIcon size={17} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm tracking-wide leading-none">BOSSTICKET</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_#4ade80] flex-shrink-0" />
                <span className="text-white/40 text-[10.5px]">Trực tuyến • Phản hồi ngay</span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-white transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-scroll flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-3.5">
            {messages.map(msg => (
              <div key={msg.id} className={`animate-fade-msg flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[84%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5 bg-gradient-to-br from-red-500 to-red-900">
                      <FilmIcon size={11} />
                    </div>
                  )}
                  <div className={`px-3.5 py-2.5 ${msg.sender === 'user' ? 'rounded-[18px] rounded-br-[4px] bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_4px_16px_rgba(239,68,68,0.3)]' : 'rounded-[18px] rounded-bl-[4px] bg-white/[0.07] text-white/85 border border-white/[0.08]'}`}>
                    <MessageText text={msg.text} />
                  </div>
                </div>
                <span className={`text-[10px] text-white/25 mt-1 ${msg.sender === 'bot' ? 'pl-8' : ''}`}>{msg.time}</span>
              </div>
            ))}

            {loading && <div className="animate-fade-msg"><TypingIndicator /></div>}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="flex gap-1.5 px-3.5 py-2 overflow-x-auto flex-shrink-0 border-t border-white/[0.05] [&::-webkit-scrollbar]:hidden">
              {QUICK_REPLIES.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-1.5 rounded-full flex-shrink-0 whitespace-nowrap bg-white/5 border border-white/10 text-white/60 hover:bg-red-500/15 hover:border-red-500/40 hover:text-white transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-center gap-2 px-3.5 py-3 flex-shrink-0 bg-black/30 border-t border-white/[0.06]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              maxLength={300}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.07] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-all duration-200"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Toggle Button (Chỉ giữ lại nút nổi ở góc dưới) ── */}
      {/* NẾU BẠN ĐÃ CÓ NÚT TOGGLE TRONG Userlayout.tsx, BẠN CÓ THỂ BỎ ĐOẠN NÀY VÀ ĐƯA STATE `open` RA NGOÀI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {open && <div className="pointer-events-auto w-[350px] h-0" />} 
        <button
          onClick={() => setOpen(v => !v)}
          className="pointer-events-auto relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-800 shadow-[0_8px_28px_rgba(239,68,68,0.45)] hover:scale-110 hover:shadow-[0_12px_36px_rgba(239,68,68,0.6)] transition-all duration-300"
        >
          {!open && <span className="animate-pulse-ring absolute inset-[-5px] rounded-full border-2 border-red-500/50 pointer-events-none" />}
          {open
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          }
        </button>
      </div>
    </>
  );
};

export default ChatbotUI;