// client/src/components/movie-observations/SceneFrame.jsx

import React from 'react';
import { ImageOff } from 'lucide-react';

const SceneFrame = ({ label, timestamp, imageUrl, alt }) => {
    return (
        <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                {label} • {timestamp}
            </span>
            {imageUrl ? (
                // If the image URL exists, display the image
                <img 
                    src={imageUrl} 
                    alt={alt} 
                    className="mt-1 w-full h-40 object-cover rounded-md border dark:border-slate-600 bg-gray-200 dark:bg-slate-700"
                />
            ) : (
                // If the URL is missing, display a helpful placeholder
                <div className="mt-1 w-full h-40 flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-700/50 rounded-md border-2 border-dashed border-gray-300 dark:border-slate-600">
                    <ImageOff className="w-8 h-8 text-gray-400 dark:text-slate-500 mb-2" />
                    <p className="text-xs text-center text-gray-500 dark:text-slate-400">
                        Image not available.
                    </p>
                    <p className="text-xs text-center text-teal-600 dark:text-teal-400 font-semibold">
                        Suggest an edit to add it!
                    </p>
                </div>
            )}
        </div>
    );
};

export default SceneFrame;