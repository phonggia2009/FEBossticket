import React from 'react';

interface Props {
  activeTab: 'now-showing' | 'coming-soon';
  setActiveTab: (tab: 'now-showing' | 'coming-soon') => void;
  nowShowingCount: number;
  comingSoonCount: number;
}

const MovieTabs: React.FC<Props> = ({ activeTab, setActiveTab, nowShowingCount, comingSoonCount }) => {
  return (
    <div className="flex justify-center items-center gap-8 mb-8 border-b border-zinc-800/60 pb-4">
      <button 
        onClick={() => setActiveTab('now-showing')}
        className={`text-xl font-black uppercase tracking-wide transition-all duration-300 ${
          activeTab === 'now-showing' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Đang Chiếu ({nowShowingCount})
      </button>
      <button 
        onClick={() => setActiveTab('coming-soon')}
        className={`text-xl font-black uppercase tracking-wide transition-all duration-300 ${
          activeTab === 'coming-soon' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Sắp Chiếu ({comingSoonCount})
      </button>
    </div>
  );
};

export default MovieTabs;