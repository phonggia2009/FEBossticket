import React from 'react';
import type { MovieDetail } from '../type';

interface Props {
  movie: MovieDetail;
}

const MovieBanner: React.FC<Props> = ({ movie }) => {
  const backgroundImageUrl = movie.banners?.length > 0 ? movie.banners[0] : movie.posterUrl;

  return (
    <div className="relative w-full h-[40vh] md:h-[55vh] rounded-2xl overflow-hidden shadow-2xl">
      <img 
        src={backgroundImageUrl} alt="Background" 
        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
    </div>
  );
};

export default MovieBanner;