import React from 'react';
import { FilmIcon } from './Icon';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-2">
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/40">
      <FilmIcon size={12} />
    </div>
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </div>
  </div>
);