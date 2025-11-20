import React, { useState, useEffect } from "react";

// Converts "HH:MM:SS" → seconds
function toSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(timeStr) || 0;
}

// Converts seconds → "HH:MM:SS"
function toTimestamp(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

export default function TimestampSelector({ startTime, endTime, value, onChange }) {

  const startSec = toSeconds(startTime);
  const endSec = toSeconds(endTime);
  const duration = endSec - startSec;

  const [sliderPos, setSliderPos] = useState(0);

  // When slider moves → update timestamp
  const handleSlider = (percent) => {
    setSliderPos(percent);
    const sec = startSec + Math.round((percent / 100) * duration);
    onChange(toTimestamp(sec));
  };

  // When user types manually → update slider
  const handleManual = (text) => {
    onChange(text);
    const sec = toSeconds(text);
    if (sec >= startSec && sec <= endSec) {
      const percent = ((sec - startSec) / duration) * 100;
      setSliderPos(percent);
    }
  };

  useEffect(() => {
    // Initialize slider from initial value
    if (value) {
      const sec = toSeconds(value);
      const percent = ((sec - startSec) / duration) * 100;
      setSliderPos(percent);
    }
  }, [startTime, endTime]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        Timestamp (optional)
      </label>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => handleSlider(Number(e.target.value))}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
        <span>{startTime}</span>
        <span>{endTime}</span>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => handleManual(e.target.value)}
        placeholder="HH:MM:SS"
        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 
                   bg-white dark:bg-slate-700 rounded-md"
      />

      <p className="text-xs text-gray-400 dark:text-slate-400">
        Drag the slider or enter a timestamp manually.
      </p>
    </div>
  );
}
