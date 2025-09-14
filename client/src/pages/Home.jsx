/**
 * The main hero section for the homepage.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Film, Loader2 } from 'lucide-react';
import axios from "../api/axios";
import Header from '../components/Header';

const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const recentlyViewedMovies = [
  { id: 76600, title: 'Avatar: The Way of Water', poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
  { id: 315162, title: 'Puss in Boots: The Last Wish', poster_path: '/kuf6dutpsT0vSVehL3kaeavs2Q4.jpg' },
  { id: 49046, title: 'All Quiet on the Western Front', poster_path: '/hYqOjJ7JCF1gUStdic32OQ4d5zY.jpg' },
];

const MovieCard = ({ movie }) => (
  <Link to={`/movie/${movie.id}`} className="block group flex-shrink-0 w-40 md:w-48">
    <div className="aspect-[2/3] bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden transition-transform transform group-hover:scale-105 group-hover:shadow-xl">
      {movie.poster_path ? (
        <img src={`${tmdbImageBaseUrl}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700">
          <Film size={48} />
        </div>
      )}
    </div>
    <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">{movie.title}</h3>
  </Link>
);

const MovieCarousel = ({ title, movies, isLoading }) => {
    if (isLoading) {
        return (
            <section className="mb-12">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{title}</h2>
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-teal-600 dark:text-teal-500" size={40} />
                </div>
            </section>
        );
    }

    if (!movies || movies.length === 0) return null;
    
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100">{title}</h2>
                <Link to={`/movies/category/${title.toLowerCase().replace(' ', '-')}`} className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300">
                    See All <ArrowRight size={14} />
                </Link>
            </div>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6">
                {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
        </section>
    );
};

const Hero = () => (
  <div className="relative h-80 md:h-96 bg-gray-900 overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
      alt="Cinema background"
      className="absolute inset-0 w-full h-full object-cover opacity-30"
    />
    <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Deconstruct Your Favorite Films</h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-300">
        Join a community of film enthusiasts in scene-by-scene analysis and in-depth discussion.
      </p>
      <Link 
        to="/movies" 
        className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
      >
        Explore Films
      </Link>
    </div>
  </div>
);

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trendingRes, topRatedRes] = await Promise.all([
          axios.get('/movies/trending'),
          axios.get('/movies/top-rated')
        ]);
        
        setTrendingMovies(trendingRes.data);
        setTopRatedMovies(topRatedRes.data);

      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError('Could not load film data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <Header/>
      <div className="bg-white dark:bg-slate-800 min-h-screen pt-16 transition-colors"> 
        <Hero />
        <main className="container mx-auto px-6 py-12">
          {error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <MovieCarousel title="Trending Now" movies={trendingMovies} isLoading={loading} />
              <MovieCarousel title="Top Rated" movies={topRatedMovies} isLoading={loading} />
              {!authLoading && user && (
                <MovieCarousel title="Recently Viewed" movies={recentlyViewedMovies} isLoading={false} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
