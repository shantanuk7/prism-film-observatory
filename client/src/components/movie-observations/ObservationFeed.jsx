import React from 'react';
import { Link } from 'react-router-dom';
import ObservationPost from './posts/ObservationPost';
import FilterBar from './FilterBar';
import QuickStats from './QuickStats';

const ObservationFeed = ({ 
  observations, 
  user, 
  onLike, 
  onBookmark, 
  categories, 
  activeCategory, 
  setActiveCategory, 
  sort, 
  setSort 
}) => {
  const renderFeed = () => {
    if (observations.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-slate-400 py-12">
          <p>No observations for this scene yet. Be the first!</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {observations.map(obs => (
          <ObservationPost key={obs._id} observation={obs} user={user} onLike={onLike} onBookmark={onBookmark} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <FilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        sort={sort}
        setSort={setSort}
        categories={categories}
        type="observations"
      />

      <QuickStats 
        totalCount={categories.length > 0 ? observations.length : 0}
        filteredCount={observations.length}
        activeCategory={activeCategory}
        type="observations"
      />

      {renderFeed()}

      {!user && (
        <div className="mt-8 text-center bg-white dark:bg-slate-800 border border-teal-500/20 dark:border-teal-400/20 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Want to contribute?</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
            <Link to="/observer/login" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">Log in</Link> or <Link to="/observer/register" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">sign up</Link> to upload your own in-depth analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default ObservationFeed;