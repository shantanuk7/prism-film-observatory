import React from 'react';

export default function ContributorDashboard() {
  return (
    <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          Contributor Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          Welcome! Here you can add new movies to our database or manage scenes for existing ones.
        </p>
      </div>

      <div className="mt-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border dark:border-slate-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-slate-200">Manage Movie Scenes</h2>
          <p className="text-gray-600 dark:text-slate-300 mt-1">
            Functionality to search for a movie and manage its scenes will be implemented here.
          </p>
          <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
            Find a Movie
          </button>
        </div>
      </div>
    </div>
  );
}