import React from 'react';
import { FilmIcon } from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/60 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-md rotate-6 flex items-center justify-center">
              <FilmIcon className="w-3.5 h-3.5 text-white -rotate-6" />
            </div>
            <span className="text-zinc-500 font-black text-sm tracking-wide">
              BOSS<span className="text-red-700">TICKET</span>
            </span>
          </div>
          <p className="text-zinc-700 text-xs tracking-wide">
            © {new Date().getFullYear()} BOSS_TICKET. All rights reserved.
          </p>
          <div className="flex items-end gap-1">
            {[2, 3, 3, 3, 2].map((h, i) => (
              <div
                key={i}
                className="w-3 rounded-t-sm bg-zinc-800 border border-zinc-700/50"
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;