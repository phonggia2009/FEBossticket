import React from 'react';
import { useHome } from './useHome';
import HomeBanner from './components/HomeBanner';
import MovieTabs from './components/MovieTabs';
import MovieList from './components/MovieList';
import PromotionSection from './components/PromotionSection';

const Home: React.FC = () => {
  const { 
    movies, loading, activeTab, setActiveTab, 
    nowShowingCount, comingSoonCount, displayMovies 
  } = useHome();

  return (
    <div className="flex flex-col gap-12 bg-[#0a0a0a] pb-12 min-h-screen">
      {/* 1. HERO BANNER */}
      <HomeBanner />

      {/* 2. MAIN CONTENT - TABS & GRID */}
      <div>
        <MovieTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          nowShowingCount={nowShowingCount} 
          comingSoonCount={comingSoonCount} 
        />
        
        <MovieList movies={displayMovies} loading={loading} />
        <PromotionSection />
      </div>
    </div>
  );
};

export default Home;