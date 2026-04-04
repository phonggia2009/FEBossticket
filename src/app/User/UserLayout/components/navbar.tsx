import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilmIcon, SearchIcon, XIcon, UserIcon, TicketIcon, LogoutIcon, LoginIcon } from './Icon';
import type { SearchMovie } from '../type';

interface NavbarProps {
  user: any;
  searchOpen: boolean;
  setSearchOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  searchResults: SearchMovie[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: (val: boolean) => void;
  handleSearch: (e?: React.FormEvent) => void;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user, searchOpen, setSearchOpen, searchQuery, setSearchQuery,
  dropdownOpen, setDropdownOpen, searchResults, isSearching,
  showResults, setShowResults, handleSearch, handleLogout
}) => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Click ra ngoài để đóng search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (searchQuery.trim() === '') {
          setSearchOpen(false);
          setShowResults(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery, setSearchOpen, setShowResults]);

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* LẼ TRÁI: Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 bg-red-600 rounded-xl rotate-6 flex items-center justify-center shadow-lg shadow-red-900/40 transition-transform duration-300 group-hover:rotate-0">
              <FilmIcon className="w-5 h-5 text-white -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <span className="text-white font-black text-xl tracking-wider">
              BOSS<span className="text-red-600">TICKET</span>
            </span>
          </Link>

          {/* Ở GIỮA: Nav links (Tăng khoảng cách gap-8) */}
          <div className="hidden md:flex items-center gap-8 ml-8 flex-1">
            {[
              { label: 'Phim đang chiếu', to: '/now-showing' },
              { label: 'Phim sắp chiếu', to: '/upcoming' },
              { label: 'Rạp chiếu', to: '/cinemas' },
              { label: 'Dành cho bạn', to: '/for-you' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[15px] font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* LẼ PHẢI: Search + User Actions */}
          <div className="flex items-center gap-5">
            
            {/* 1. Search Bar */}
            <div className="relative flex items-center" ref={searchRef}> 
              <form 
                onSubmit={handleSearch}
                className={`flex items-center gap-2 rounded-xl border transition-all duration-300 overflow-hidden h-10 ${
                  searchOpen 
                    ? 'w-64 border-red-600 bg-zinc-900 shadow-lg shadow-red-950/30 px-3' 
                    : 'w-10 border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 justify-center cursor-pointer'
                }`}
                onClick={() => { if (!searchOpen) setSearchOpen(true); }}
              >
                <button
                  type={searchOpen && searchQuery.trim() ? "submit" : "button"}
                  className="flex-shrink-0 flex items-center justify-center w-6 h-6 outline-none"
                >
                  <SearchIcon className={`w-4 h-4 transition-colors duration-200 ${searchOpen ? 'text-red-500' : 'text-zinc-400'}`} />
                </button>
                
                {searchOpen && (
                  <>
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setShowResults(false);
                        }
                      }}
                      placeholder="Tìm phim, rạp..."
                      className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 outline-none w-full"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation();
                          setSearchQuery(''); 
                          setShowResults(false);
                          // Không đóng bar nếu người dùng chỉ muốn xoá text
                        }}
                        className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                )}
              </form>

              {/* Dropdown Live Search */}
              {searchOpen && showResults && (
                <div className="absolute top-[calc(100%+12px)] right-0 w-[320px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black overflow-hidden z-50 animate-fade-in-up">
                  {isSearching ? (
                    <div className="p-6 text-center flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-zinc-400 text-sm font-medium">Đang tìm kiếm...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      <div className="px-4 py-3 bg-zinc-950/50 border-b border-zinc-800/60 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Phim gợi ý
                      </div>
                      {searchResults.map(movie => (
                        <div 
                          key={movie.id}
                          onClick={() => {
                            navigate(`/movie/${movie.id}`);
                            setSearchOpen(false);
                            setSearchQuery('');
                            setShowResults(false);
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-zinc-800/60 cursor-pointer transition-colors border-b border-zinc-800/50 last:border-0"
                        >
                          <img src={movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded-md shadow-md" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-bold truncate">{movie.title}</h4>
                            <p className="text-zinc-500 text-xs mt-1 truncate">{movie.genre}</p>
                          </div>
                        </div>
                      ))}
                      <div className="p-2 bg-zinc-950/80 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => handleSearch()}
                          className="w-full py-2.5 text-sm text-red-500 hover:text-white hover:bg-red-600 rounded-xl transition-colors text-center font-bold"
                        >
                          Xem tất cả kết quả
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                        <SearchIcon className="w-5 h-5 text-zinc-500" />
                      </div>
                      <span className="text-zinc-400 text-sm">Không tìm thấy "{searchQuery}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. User Actions */}
            {user ? (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`flex items-center gap-3 pl-1.5 pr-4 py-1.5 border rounded-full transition-all duration-200 ${
                    dropdownOpen 
                      ? 'bg-zinc-900 border-zinc-700 shadow-md' 
                      : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  {/* Avatar Icon đỏ */}
                  <div className="w-8 h-8 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4 text-red-500" />
                  </div>
                  {/* Tên User */}
                  <span className="text-[14px] text-zinc-400 hidden sm:inline tracking-wide">
                    Xin chào, <span className="font-bold text-white">{user.fullName}</span>
                  </span>
                  {/* Mũi tên Dropdown */}
                  <svg className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180 text-white' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu User */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 z-20 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black overflow-hidden animate-fade-in-up">
                      <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-950/30">
                        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-black mb-1">Tài khoản</p>
                        <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors">
                          <TicketIcon className="w-4 h-4 text-red-500" />
                          <span>Vé của tôi</span>
                        </Link>
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors">
                          <UserIcon className="w-4 h-4 text-zinc-400" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                      </div>
                      <div className="border-t border-zinc-800/80 py-2 bg-zinc-950/30">
                        <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-950/30 transition-colors">
                          <LogoutIcon className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-900/30 hover:-translate-y-0.5 transition-all">
                <LoginIcon className="w-4 h-4" /> Đăng nhập
              </button>
            )}
          </div>

        </div>
      </div>
      <div className="h-[1.5px] bg-gradient-to-r from-transparent via-red-600/80 to-transparent opacity-70" />
    </nav>
  );
};

export default Navbar;