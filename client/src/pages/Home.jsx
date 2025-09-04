import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Film } from 'lucide-react';

// --- Mock Data (simulating TMDB API response) ---
const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const trendingMovies = [
  { id: 550, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
  { id: 680, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  { id: 27205, title: 'Inception', poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { id: 157336, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 13, title: 'Forrest Gump', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
  { id: 299534, title: 'Avengers: Endgame', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
];
const topRatedMovies = [
  { id: 238, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
  { id: 278, title: 'The Shawshank Redemption', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmq.jpg' },
  { id: 240, title: 'The Godfather Part II', poster_path: '/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg' },
  { id: 424, title: 'Schindler\'s List', poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
  { id: 122, title: 'The Lord of the Rings: The Return of the King', poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' },
  { id: 129, title: 'Spirited Away', poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
];
const recentlyViewedMovies = [ 
  { id: 76600, title: 'Avatar: The Way of Water', poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
  { id: 315162, title: 'Puss in Boots: The Last Wish', poster_path: '/kuf6dutpsT0vSVehL3kaeavs2Q4.jpg' },
  { id: 49046, title: 'All Quiet on the Western Front', poster_path: '/hYqOjJ7JCF1gUStdic32OQ4d5zY.jpg' },
];


/**
 * A reusable card component to display a movie poster.
 * Links to the movie's detail page.
 */
const MovieCard = ({ movie }) => (
  <Link to={`/movie/${movie.id}`} className="block group flex-shrink-0 w-40 md:w-48">
    <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden transition-transform transform group-hover:scale-105 group-hover:shadow-xl">
      {movie.poster_path ? (
        <img src={`${tmdbImageBaseUrl}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <Film size={48} />
        </div>
      )}
    </div>
    <h3 className="mt-2 text-sm font-medium text-gray-800 truncate group-hover:text-indigo-600">{movie.title}</h3>
  </Link>
);


/**
 * A reusable component to display a horizontal list of movies.
 */
const MovieCarousel = ({ title, movies }) => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      <Link to={`/movies/category/${title.toLowerCase().replace(' ', '-')}`} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
        See All <ArrowRight size={14} />
      </Link>
    </div>
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6">
      {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  </section>
);


/**
 * The main hero section for the homepage.
 */
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
        className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Explore Films
      </Link>
    </div>
  </div>
);


/**
 * The main container for the homepage.
 */
export default function Home() {
  const { user, loading } = useAuth();

  return (
    // pt-16 provides top padding to offset the fixed header
    <div className="bg-white min-h-screen pt-16"> 
      <Hero />
      <main className="container mx-auto px-6 py-12">
        <MovieCarousel title="Trending Now" movies={trendingMovies} />
        <MovieCarousel title="Top Rated" movies={topRatedMovies} />
        {!loading && user && (
          <MovieCarousel title="Recently Viewed" movies={recentlyViewedMovies} />
        )}
      </main>
    </div>
  );
}

