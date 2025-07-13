// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import api from '../api';
import MovieCard from '../components/MovieCard';

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/movies/search?query=${query}`);
      setMovies(res.data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movies/discover', {
        params: filters,
      });
      setMovies(res.data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) searchMovies();
    else if (filters.genre || filters.year || filters.rating) filterMovies();
  }, [query, filters]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Discover Movies</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search movies"
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Genre ID (e.g., 28 for Action)"
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            className="p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by genre"
          />
          <input
            type="number"
            placeholder="Year (e.g., 2023)"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by year"
          />
          <input
            type="number"
            placeholder="Min Rating (1-10)"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by minimum rating"
          />
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.length === 0 ? (
            <p className="text-gray-400">No movies found</p>
          ) : (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          )}
        </div>
      )}
    </div>
  );
}

export default Home;