import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const BookmarkCard = ({ bookmark, movie }) => {
  // 'bookmark' can be either an Observation or an Analysis object
  const isObservation = bookmark.content;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden flex transition-shadow hover:shadow-md">
      {/* Movie Poster */}
      <Link to={`/movie/${bookmark.movieId}`} className="flex-shrink-0 w-24">
        {movie.poster_path ? (
          <img src={`${tmdbImageBaseUrl}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-700">
            <Film className="text-gray-400 dark:text-slate-500" size={32} />
          </div>
        )}
      </Link>
      
      {/* Bookmark Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {isObservation ? 'OBSERVATION FROM' : 'ANALYSIS FOR'}
          </p>
          <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-1">{movie.title}</h3>
          <p className="text-sm text-gray-700 dark:text-slate-300 italic line-clamp-2">
            "{isObservation ? bookmark.content : bookmark.title}"
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            By {bookmark.user?.username || 'user'}
          </p>
          <Link to={`/movie/${bookmark.movieId}`} className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
            View Post &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;