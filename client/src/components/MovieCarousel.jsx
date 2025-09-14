import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import MovieCard from './MovieCard'

export default function MovieCarousel({ title, movies, isLoading }) {
  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-teal-600" size={40} />
        </div>
      </section>
    )
  }

  if (!movies || movies.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          to={`/movies/category/${title.toLowerCase().replace(' ', '-')}`}
          className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800"
        >
          See All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
