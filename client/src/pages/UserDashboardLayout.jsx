import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { Bookmark, History, Settings } from 'lucide-react';

const UserDashboardLayout = () => {
  const linkClasses = "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-teal-100 dark:bg-slate-700 text-teal-700 dark:text-slate-100";
  const inactiveClasses = "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800";

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 xl:col-span-2 mb-8 lg:mb-0">
            <nav className="space-y-1">
              <NavLink to="/bookmarks" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Bookmark size={18} />
                <span>Bookmarks</span>
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <History size={18} />
                <span>Viewing History</span>
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 xl:col-span-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;