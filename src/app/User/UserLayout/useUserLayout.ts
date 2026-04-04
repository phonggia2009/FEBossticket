import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/authSlice'; // Nhớ check lại đường dẫn tương đối
import type { RootState } from '../../../store';
import { searchMovies } from '../../../common/api/userAPI';
import type { SearchMovie } from '../UserLayout/type';

export const useUserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowResults(true);
      
      try {
        const response = await searchMovies(searchQuery);
        const moviesData = response.data?.data?.movies || response.data?.movies || [];

        const formattedMovies: SearchMovie[] = moviesData.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          genre: movie.genres && movie.genres.length > 0 
                  ? movie.genres.map((g: any) => g.name).join(', ') 
                  : 'Chưa cập nhật',
          image: movie.posterUrl || 'https://placehold.co/50x75/18181b/red?text=No+Image'
        }));

        setSearchResults(formattedMovies);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm phim:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    navigate,
    isHomePage,
    searchOpen, setSearchOpen,
    searchQuery, setSearchQuery,
    dropdownOpen, setDropdownOpen,
    chatOpen, setChatOpen,
    searchResults, isSearching,
    showResults, setShowResults,
    handleSearch, handleLogout
  };
};