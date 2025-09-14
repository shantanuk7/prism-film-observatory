import React from 'react';

const MovieHeader = ({ details }) => {
    if (!details) return null;

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{details.title} ({details.release_date?.substring(0,4)})</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">Runtime: {details.runtime} minutes</p>
        </div>
    );
};

export default MovieHeader;