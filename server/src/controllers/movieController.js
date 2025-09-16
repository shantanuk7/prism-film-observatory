import axios from 'axios';
import Movie from '../models/Movie.js';

// --- Simple In-Memory Cache Setup ---
const cache = new Map();
const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache results for 5 minutes

// --- Axios Instance & Interceptor Setup ---
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

tmdbApi.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.api_key = process.env.TMDB_API_KEY;
  return config;
});

const getCachedData = async (cacheKey, fetcher) => {
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    return cachedEntry.data;
  }
  const data = await fetcher();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};

// --- Controller Functions ---

export const getTrendingMovies = async (req, res) => {
  try {
    const data = await getCachedData('trending', () => 
      tmdbApi.get('/trending/movie/week').then(res => res.data.results)
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching trending movies.' });
  }
};

export const getTopRatedMovies = async (req, res) => {
  try {
    const data = await getCachedData('top_rated', () =>
      tmdbApi.get('/movie/top_rated').then(res => res.data.results)
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching top rated movies.' });
  }
};

export const searchMovies = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }
  
  const cacheKey = `search_${query}`;
  
  try {
    const data = await getCachedData(cacheKey, () => 
      tmdbApi.get('/search/movie', { params: { query } }).then(res => res.data.results)
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error while searching movies.' });
  }
};

export const getMovieDetails = async (req, res) => {
  const { movieId: tmdbId } = req.params;
  const cacheKey = `movie_${tmdbId}`;

  console.log(cacheKey);
  
  try {
    const data = await getCachedData(cacheKey, async () => {

      const tmdbPromise = tmdbApi.get(`/movie/${tmdbId}`);

      const localPromise = Movie.findOne({ tmdbId: tmdbId });
      console.log(localPromise);
      

      const [tmdbResponse, localMovie] = await Promise.all([tmdbPromise, localPromise]);

      const movieDetails = {
        ...tmdbResponse.data, // All the rich data from TMDB
        timestampSource: localMovie ? localMovie.timestampSource : null,
      };

      return movieDetails; // This merged object is cached
    });

    res.json(data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    console.error("Error in getMovieDetails:", error);
    res.status(500).json({ message: 'Server Error fetching movie details' });
  }
};