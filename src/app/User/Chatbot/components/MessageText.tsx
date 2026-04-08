import React from 'react';

interface Props {
  text: string;
}

const renderTextWithLinks = (text: string) => {
  if (!text) return null;

  // Regex tìm URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // 1. Làm sạch URL: Xóa các dấu ngoặc đơn dính ở cuối link
      const cleanUrl = part.replace(/[()]+$/, '');

      const isBookingLink = cleanUrl.includes('/booking/');

      return (
        <a
          key={index}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mx-1 text-blue-500 hover:text-blue-700 underline font-bold transition-all"
        >
          {isBookingLink ? "🎟️ [Đặt vé ngay]" : cleanUrl}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  }
)};

export const MessageText: React.FC<Props> = ({ text }) => (
  <div className="leading-relaxed text-[13px]">
    {text.split('\n').map((line, i) => (
      <div key={i} className={line === '' ? 'h-2' : ''}>
        {line === '' ? null : renderTextWithLinks(line)}
      </div>
    ))}
  </div>
);