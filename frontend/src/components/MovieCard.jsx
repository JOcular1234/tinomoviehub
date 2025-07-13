// src/components/MovieCard.jsx
import { useState, useEffect, useContext, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WatchlistContext } from '../context/WatchlistContext';
import { MovieContext } from '../context/MovieContext';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { watchlists, loading, error, createWatchlist, addToWatchlist, removeFromWatchlist } =
    useContext(WatchlistContext);
  const { getMovie } = useContext(MovieContext);
  const [selectedWatchlist, setSelectedWatchlist] = useState('');
  const [newWatchlist, setNewWatchlist] = useState('');
  const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [movieDetails, setMovieDetails] = useState(movie);
  const [loadingDetails, setLoadingDetails] = useState(!movie.title);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movie.title) {
        setLoadingDetails(true);
        try {
          const data = await getMovie(movie.id);
          setMovieDetails(data);
        } catch (err) {
          toast.error('Failed to fetch movie details');
        } finally {
          setLoadingDetails(false);
        }
      }
    };
    fetchMovieDetails();

    if (watchlists.length > 0 && !selectedWatchlist) {
      setSelectedWatchlist(watchlists[0].name);
      setShowCreateWatchlist(false);
    } else if (watchlists.length === 0) {
      setShowCreateWatchlist(true);
    }
    const watchlist = watchlists.find((wl) => wl.name === selectedWatchlist);
    setIsInWatchlist(watchlist?.movies.includes(movie.id));
  }, [watchlists, selectedWatchlist, movie, getMovie]);

  const addToFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to add to favorites');
        navigate('/login');
        return;
      }
      await axios.post(
        'http://localhost:5000/api/user/favorites',
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Added to favorites!');
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to add to favorites');
    }
  };

  const handleWatchlistAction = async () => {
    if (!selectedWatchlist) {
      toast.error('Please select a watchlist');
      return;
    }
    if (isInWatchlist) {
      await removeFromWatchlist(selectedWatchlist, movie.id);
      setIsInWatchlist(false);
    } else {
      await addToWatchlist(selectedWatchlist, movie.id);
      setIsInWatchlist(true);
    }
  };

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    const success = await createWatchlist(newWatchlist);
    if (success) {
      setSelectedWatchlist(newWatchlist);
      setNewWatchlist('');
      setShowCreateWatchlist(false);
    }
  };

  if (loadingDetails) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="w-full h-64 bg-gray-700 animate-pulse" />
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4 animate-pulse" />
          <div className="h-10 bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-10 bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-10 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105">
      <img
        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path || '/placeholder.jpg'}`}
        alt={movieDetails.title}
        className="w-full h-64 object-cover cursor-pointer"
        onClick={() => navigate(`/movie/${movieDetails.id}`)}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{movieDetails.title || 'Loading...'}</h3>
        <p className="text-gray-400">{movieDetails.release_date?.split('-')[0] || 'N/A'}</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {loading ? (
          <div className="text-center mt-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-500 mx-auto"
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
        ) : showCreateWatchlist ? (
          <form onSubmit={handleCreateWatchlist} className="mt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newWatchlist}
                onChange={(e) => setNewWatchlist(e.target.value)}
                placeholder="New watchlist name"
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="New watchlist name"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              >
                Create
              </button>
            </div>
            {watchlists.length > 0 && (
              <button
                onClick={() => setShowCreateWatchlist(false)}
                className="mt-2 w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition"
              >
                Use Existing Watchlist
              </button>
            )}
          </form>
        ) : (
          <div className="mt-2">
            <select
              value={selectedWatchlist}
              onChange={(e) => setSelectedWatchlist(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Select watchlist"
            >
              {watchlists.map((wl) => (
                <option key={wl.name} value={wl.name}>
                  {wl.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleWatchlistAction}
              className={`mt-2 w-full ${
                isInWatchlist ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white p-2 rounded-lg transition`}
            >
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
            <button
              onClick={() => setShowCreateWatchlist(true)}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Create New Watchlist
            </button>
          </div>
        )}
        <button
          onClick={addToFavorites}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add to Favorites
        </button>
      </div>
    </div>
  );
}

export default memo(MovieCard);