// src/app/User/pages/Home/components/MovieList.tsx

import React, { useEffect, useRef } from 'react';
import { Spin } from 'antd';
import MovieCard from './MovieCard';
import type { Movie } from '../type';

interface Props {
  movies: Movie[];
  loading: boolean;
}

const MovieList: React.FC<Props> = ({ movies, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Xử lý tự động cuộn (Autoplay) từ phải sang trái
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // Nếu đã cuộn đến sát mép phải, tự động quay mượt mà về đầu
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Tính toán khoảng cách trượt bằng đúng chiều rộng của 1 khung phim
          const scrollAmount = clientWidth / 4; 
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000); // Trượt mỗi 3 giây

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Spin size="large" /></div>;
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center py-10 text-zinc-500 font-medium">
        Hiện chưa có phim nào trong danh mục này.
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Container trượt ngang:
        - overflow-x-auto: Cho phép cuộn ngang
        - snap-x snap-mandatory: Hút các thẻ phim vào đúng vị trí khi cuộn
        - scroll-smooth: Cuộn mượt
        - Đoạn class cuối cùng để ẩn thanh cuộn (scrollbar) trên các trình duyệt
      */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {movies.map(movie => (
          <div 
            key={movie.id} 
            className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;