import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Using the actual AuthContext

// A placeholder for the logo asset
const prismLogo = '../src/assets/logo.png';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close user menu when clicking outside
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
      // Navigate to a search results page
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/'); // Redirect to homepage after logout
  }

  // Determine search placeholder based on the current route
  const searchPlaceholder = location.pathname.includes('/movie/')
    ? 'Search observations & analyses...'
    : 'Search all movies...';

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-30 h-16 flex items-center px-6">
      <div className="flex items-center gap-4 w-full">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src={prismLogo} alt="Prism Logo" className="w-8 h-8" />
          <span className="text-lg font-bold text-gray-900 hidden md:block">
            Prism
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl mx-auto">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-gray-100 border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
          />
        </form>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-9 h-9 bg-teal-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center"
                  >
                    <span className="text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20 animate-fade-in-up">
                      <div className="px-3 py-2 border-b">
                         <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                         <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/settings" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Settings
                        </Link>
                        <Link to="/bookmarks" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          Bookmarks
                        </Link>
                      </div>
                      <div className="my-1 h-px bg-gray-100"></div>
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                 <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/observer/login')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => navigate('/observer/register')}
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

