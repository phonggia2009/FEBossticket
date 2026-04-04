import React from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMovieDetails } from './useMovieDetails';
import MovieBanner from './components/MovieBanner';
import MovieInfo from './components/MovieInfo';
import ShowtimeSection from './components/ShowtimeSection';
import CommentSection from './components/CommentSections';

const MovieDetails: React.FC = () => {
  const navigate = useNavigate();
  const { 
    id,
    movie, loading, 
    loadingShowtimes, selectedDate, setSelectedDate, dates, groupedShowtimes 
  } = useMovieDetails();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 text-zinc-400">
        <h2 className="text-2xl font-bold text-white mb-4">Phim không tồn tại hoặc đã bị xóa.</h2>
        <button onClick={() => navigate('/')} className="text-red-500 hover:text-red-400 underline">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-fadeIn">
      <MovieBanner movie={movie} />
      
      <div className="relative z-10 px-4 md:px-8 -mt-32 md:-mt-48 max-w-6xl mx-auto w-full">
        <MovieInfo movie={movie} />
        
        <ShowtimeSection 
          dates={dates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          loadingShowtimes={loadingShowtimes}
          groupedShowtimes={groupedShowtimes}
        />
        {id && <CommentSection movieId={id} />}
      </div>
    </div>
  );
};

export default MovieDetails;