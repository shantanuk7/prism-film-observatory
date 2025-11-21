import React, { useEffect, useState } from 'react';
import { timeToSeconds, secondsToTime } from '../../utils/timeUtils';
import { Clock } from 'lucide-react';

const TimeScrubber = ({ 
  label, 
  value, 
  onChange, 
  minTime = "00:00:00", 
  maxTime = "03:00:00",
  helperText 
}) => {
  // Convert props to seconds for the slider range
  const minSeconds = timeToSeconds(minTime);
  const maxSeconds = timeToSeconds(maxTime);
  const currentSeconds = timeToSeconds(value) || minSeconds;

  const handleSliderChange = (e) => {
    const newSeconds = parseInt(e.target.value, 10);
    onChange(secondsToTime(newSeconds));
  };

  const handleInputChange = (e) => {
    // Allow user to type freely, but you might want to add masking logic here later
    onChange(e.target.value);
  };

  // Calculate percentage for the slider fill effect
  const progressPercent = ((currentSeconds - minSeconds) / (maxSeconds - minSeconds)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-xs font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded">
          {value || "00:00:00"}
        </span>
      </div>

      {/* The Visual Slider */}
      <div className="relative w-full h-6 flex items-center group">
        {/* Background Track */}
        <div className="absolute w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
           {/* Progress Fill */}
           <div 
             className="h-full bg-teal-500 transition-all duration-75 ease-out" 
             style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
           />
        </div>

        {/* The Actual Range Input (Invisible but interactive) */}
        <input
          type="range"
          min={minSeconds}
          max={maxSeconds}
          value={currentSeconds}
          onChange={handleSliderChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* The Thumb (Visual Customization) */}
        <div 
          className="absolute h-5 w-5 bg-white dark:bg-slate-200 border-2 border-teal-600 rounded-full shadow-md pointer-events-none transition-all duration-75 ease-out"
          style={{ left: `calc(${Math.max(0, Math.min(100, progressPercent))}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1 font-mono">
        <span>{minTime}</span>
        <span>{maxTime}</span>
      </div>

      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
};

export default TimeScrubber;