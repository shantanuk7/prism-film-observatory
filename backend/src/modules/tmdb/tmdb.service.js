const fetch = require('node-fetch');

const TMDB_BASE = 'https://api.themoviedb.org/3';

async function tmdbFetch(path, params = {}) {
  const url = new URL(TMDB_BASE + path);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDb error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function searchMovies(query, page = 1) {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  return tmdbFetch('/search/movie', { query, page: String(page), include_adult: 'false' });
}

module.exports = { searchMovies };
