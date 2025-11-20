import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Film, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from "../api/axios";
import Header from '../components/Header';

const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

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
    const scrollRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1); // -1 for precision
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const scroller = scrollRef.current;
        scroller?.addEventListener('scroll', checkScrollPosition);
        return () => scroller?.removeEventListener('scroll', checkScrollPosition);
    }, [movies]);


    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

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
        <section className="mb-12 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100">{title}</h2>
                <Link to={`/movies/category/${title.toLowerCase().replace(' ', '-')}`} className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300">
                    See All <ArrowRight size={14} />
                </Link>
            </div>
            <div className="relative scrollbar-hide">
                <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide scroll-smooth">
                    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
                {/* Left Arrow */}
                {!isAtStart && (
                    <button onClick={() => handleScroll('left')} className="absolute top-1/2 left-0 -translate-y-1/2 transform bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-12 w-12 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-700 transition-opacity z-10 disabled:opacity-0">
                        <ChevronLeft className="text-gray-800 dark:text-slate-200"/>
                    </button>
                )}
                {/* Right Arrow */}
                {!isAtEnd && (
                     <button onClick={() => handleScroll('right')} className="absolute top-1/2 right-0 -translate-y-1/2 transform bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-12 w-12 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-700 transition-opacity z-10 disabled:opacity-0">
                        <ChevronRight className="text-gray-800 dark:text-slate-200"/>
                    </button>
                )}
            </div>
        </section>
    );
};


const Hero = () => (
    <div className="relative h-80 md:h-96 bg-gray-900 overflow-hidden">
        {/* <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80" alt="Cinema background" className="absolute inset-0 w-full h-full object-cover opacity-30" /> */}
        <img src="hero.webp" alt="Cinema background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Deconstruct Your Favorite Films</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-300">Join a community of film enthusiasts in scene-by-scene analysis and in-depth discussion.</p>
        </div>
    </div>
);

export default function HomePage() {
    const { user, loading: authLoading } = useAuth();
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [recentlyViewedMovies, setRecentlyViewedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicMovies = async () => {
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
        fetchPublicMovies();
    }, []);

    useEffect(() => {
        // Fetch recently viewed only if a user is logged in
        if (user) {
            const fetchHistory = async () => {
                try {
                    setHistoryLoading(true);
                    const res = await axios.get('/users/history');
                    setRecentlyViewedMovies(res.data);
                } catch (err) {
                    console.error("Failed to fetch view history:", err);
                } finally {
                    setHistoryLoading(false);
                }
            };
            fetchHistory();
        } else {
            // If user logs out, clear the list
            setRecentlyViewedMovies([]);
            setHistoryLoading(false);
        }
    }, [user]);

    return (
        <div>
            <Header />
            <div className="bg-white dark:bg-slate-800 min-h-screen pt-16 transition-colors">
                <Hero />
                <main className="container mx-auto px-6 py-12">
                    {error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                      <>
                            {!authLoading && user && (
                                <MovieCarousel title="Recently Viewed" movies={recentlyViewedMovies} isLoading={historyLoading} />
                            )}
                            <MovieCarousel title="Trending Now" movies={trendingMovies} isLoading={loading} />
                            <MovieCarousel title="Top Rated" movies={topRatedMovies} isLoading={loading} />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}