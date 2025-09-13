import axios from 'axios';

// --- Simple In-Memory Cache Setup ---
const cache = new Map();
const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache results for 5 minutes

// --- Axios Instance & Interceptor Setup ---
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

/**
 * Use an interceptor to dynamically add the API key to every request.
 * This is a more robust method than setting default params.
 */
tmdbApi.interceptors.request.use((config) => {
  // Ensure the params object exists on the request config
  config.params = config.params || {};
  // Add the api_key to the request parameters
  config.params.api_key = process.env.TMDB_API_KEY;
  return config;
});

/**
 * A generic function to fetch data from TMDB with caching.
 * @param {string} cacheKey - A unique key for the cache entry.
 * @param {Function} fetcher - An async function that fetches data from TMDB.
 * @returns {Promise<any>} - The data from cache or API.
 */
const getCachedData = async (cacheKey, fetcher) => {
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    // Return from cache if valid
    return cachedEntry.data;
  }

  // Otherwise, fetch from the API
  const data = await fetcher();
  
  // Store the new data in the cache
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
};


// --- Controller Functions (Now relying on the interceptor) ---

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
      // The interceptor now handles the API key, so we only need to pass the query
      tmdbApi.get('/search/movie', { params: { query } }).then(res => res.data.results)
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error while searching movies.' });
  }
};

export const getMovieDetails = async (req, res) => {
  const { movieId } = req.params;
  const cacheKey = `movie_${movieId}`;
  
  try {
    const data = await getCachedData(cacheKey, () => 
      // The interceptor adds the API key here as well
      tmdbApi.get(`/movie/${movieId}`).then(res => res.data)
    );
    res.json(data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.status(500).json({ message: 'Server Error fetching movie details' });
  }
};

