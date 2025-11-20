import React, { useMemo } from 'react';
import { timeToSeconds, secondsToTime } from '../../utils/timeUtils';
import { Plus } from 'lucide-react';

const TimelineVisualizer = ({ scenes, movieDuration = "02:30:00", onSelectGap }) => {
    const totalSeconds = timeToSeconds(movieDuration);

    const timelineData = useMemo(() => {
        const sorted = [...scenes].sort((a, b) => timeToSeconds(a.startTime) - timeToSeconds(b.startTime));
        const tracks = [];
        let cursor = 0;

        sorted.forEach(scene => {
            const start = timeToSeconds(scene.startTime);
            const end = timeToSeconds(scene.endTime);

            if (start > cursor + 5) { 
                tracks.push({ type: 'gap', start: cursor, end: start });
            }

            tracks.push({ type: 'scene', start, end, data: scene });
            cursor = end;
        });

        if (cursor < totalSeconds) {
            tracks.push({ type: 'gap', start: cursor, end: totalSeconds });
        }

        return tracks;
    }, [scenes, totalSeconds]);

    return (
        <div className="mb-8 select-none">
            <div className="flex justify-between items-end mb-2 px-1">
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 tracking-wider uppercase">
                    Timeline Map
                </label>
                <div className="flex gap-4 text-[10px] font-medium text-gray-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> 
                        Occupied
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-100 border border-teal-300 dark:bg-teal-900/30 dark:border-teal-700"></span> 
                        Available
                    </span>
                </div>
            </div>
            
            {/* The Visual Bar */}
            <div className="relative h-12 w-full bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex border border-gray-200 dark:border-slate-700 shadow-inner">
                {timelineData.map((item, idx) => {
                    const widthPercent = ((item.end - item.start) / totalSeconds) * 100;
                    
                    if (item.type === 'scene') {
                        return (
                            <div 
                                key={idx}
                                style={{ width: `${widthPercent}%` }}
                                className="h-full bg-slate-300 dark:bg-slate-600 border-r border-white/50 dark:border-slate-800 relative group cursor-default"
                            >
                                {/* Simple hover tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-slate-800/10 dark:bg-black/20 transition-opacity">
                                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">#{item.data.sceneNumber}</span>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onSelectGap(secondsToTime(item.start), secondsToTime(item.end))}
                                style={{ width: `${widthPercent}%` }}
                                className="h-full bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 flex items-center justify-center cursor-pointer group relative transition-all duration-200"
                            >
                                {/* Pattern Overlay for 'Empty' feel */}
                                <div className="absolute inset-0 opacity-30" 
                                     style={{ backgroundImage: 'radial-gradient(#0d9488 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}>
                                </div>
                                
                                {/* Icon only shows on hover to prevent crowding */}
                                <div className="z-10 opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-200 bg-teal-600 text-white rounded-full p-1 shadow-sm">
                                    <Plus size={14} strokeWidth={3} />
                                </div>
                            </button>
                        );
                    }
                })}
            </div>

            {/* Ruler Numbers */}
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1 px-1">
                <span>00:00:00</span>
                <span>{movieDuration}</span>
            </div>
        </div>
    );
};

export default TimelineVisualizer;