import { Link } from 'react-router-dom'
import { Film } from 'lucide-react'

const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500'

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="block group flex-shrink-0 w-40 md:w-48"
    >
      <div className="aspect-[2/3] bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden transition-transform transform group-hover:scale-105 group-hover:shadow-xl">
        {movie.poster_path ? (
          <img
            src={`${tmdbImageBaseUrl}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700">
            <Film size={48} />
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
        {movie.title}
      </h3>
    </Link>
  )
}