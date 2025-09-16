import React from 'react';
import { Link } from 'react-router-dom';
import AnalysisPost from './posts/AnalysisPost';
import FilterBar from './FilterBar';

const AnalysisFeed = ({ analyses, user, onLike, onBookmark, sort, setSort }) => {
    
  const renderFeed = () => {
    if (analyses.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-slate-400 py-12">
          <p>No analysis has been uploaded for this movie yet.</p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {analyses.map(anl => (
          <AnalysisPost key={anl._id} analysis={anl} user={user} onLike={onLike} onBookmark={onBookmark} />
        ))}
      </div>
    );
  };
    
  return (
    <div>
      <FilterBar
        sort={sort}
        setSort={setSort}
        type="analyses"
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

export default AnalysisFeed;