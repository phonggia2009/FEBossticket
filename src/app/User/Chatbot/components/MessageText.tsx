import React from 'react';

interface Props {
  text: string;
}

export const MessageText: React.FC<Props> = ({ text }) => (
  <div className="leading-relaxed text-[13px]">
    {text.split('\n').map((line, i) => (
      <div key={i} className={line === '' ? 'h-2' : ''}>{line}</div>
    ))}
  </div>
);