import { Info } from 'lucide-react';

const MovieHeader = ({ details }) => {
    if (!details) return null;

    const tmdbUrl = `https://www.themoviedb.org/movie/${details.id}`;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{details.title} ({details.release_date?.substring(0,4)})</h1>
                <a href={tmdbUrl} target="_blank" rel="noopener noreferrer" title="View on TMDB" className="text-teal-500 hover:text-teal-400">
                    <Info size={20} />
                </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Runtime: {details.runtime} minutes</p>

            {details.timestampSource && (
                 <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                    Timestamps based on the {details.timestampSource.url ? 
                        <a href={details.timestampSource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-500">
                            {details.timestampSource.name}
                        </a> 
                        : details.timestampSource.name
                    }.
                </p>
            )}
        </div>
    );
};

export default MovieHeader;