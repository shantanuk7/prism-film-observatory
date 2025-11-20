import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bookmark, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const prismLogo = '/logo.png';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  }

  const searchPlaceholder = location.pathname.includes('/movie/')
    ? 'Search observations & analyses...'
    : 'Search all movies...';

  const navLinkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800";
  const activeNavLinkClasses = "bg-gray-100 dark:bg-slate-800 text-teal-600 dark:text-white";

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 fixed top-0 left-0 w-full z-30 h-16 flex items-center px-4 sm:px-6">
      <div className="flex items-center gap-4 w-full">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src={prismLogo} alt="Prism Logo" className="w-8 h-8" />
          <span className="text-lg font-bold text-gray-900 dark:text-slate-100 hidden md:block">Prism</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg mx-auto">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={searchPlaceholder} className="w-full bg-gray-100 dark:bg-slate-800 border border-transparent dark:text-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:bg-slate-700 transition" />
        </form>

        <div className="flex items-center gap-2 sm:gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <nav className="hidden md:flex items-center gap-2">
                    <NavLink to="/bookmarks" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                        <Bookmark size={16} /> Bookmarks
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                        <History size={16} /> History
                    </NavLink>
                  </nav>
                  
                  <ThemeToggle />
                  <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-9 h-9 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900 flex items-center justify-center overflow-hidden">
                      <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg py-1 z-20 animate-fade-in-up">
                        <div className="px-3 py-2 border-b dark:border-slate-700">
                          <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{user.username}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {user.role === 'admin' && (
                            <Link to="/admin/dashboard" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                Admin Dashboard
                            </Link>
                          )}
                          <Link to="/settings" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Settings</Link>
                          {/* Add links for mobile view */}
                          <Link to="/bookmarks" onClick={() => setIsUserMenuOpen(false)} className="md:hidden block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Bookmarks</Link>
                          <Link to="/history" onClick={() => setIsUserMenuOpen(false)} className="md:hidden block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">History</Link>
                        </div>
                        <div className="my-1 h-px bg-gray-100 dark:bg-slate-700"></div>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Logout</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/observer/login')} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer">Log In</button>
                    <button onClick={() => navigate('/observer/register')} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors cursor-pointer">Sign Up</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}