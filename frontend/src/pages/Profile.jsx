// src/pages/Profile.jsx
import { useState, useEffect, useContext, useMemo } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { WatchlistContext } from '../context/WatchlistContext';
import { MovieContext } from '../context/MovieContext'; // New context for caching
import MovieCard from '../components/MovieCard';

function Profile() {
  const { watchlists, fetchWatchlists, createWatchlist, deleteWatchlist } = useContext(WatchlistContext);
  const { getMovie } = useContext(MovieContext); // Use movie cache
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState({});
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [newWatchlist, setNewWatchlist] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('profile');

  // Batch fetch movie details to avoid overwhelming the browser
  const batchFetchMovies = async (movieIds) => {
    const BATCH_SIZE = 5; // Limit concurrent requests
    const results = [];
    for (let i = 0; i < movieIds.length; i += BATCH_SIZE) {
      const batch = movieIds.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (id) => {
          try {
            return await getMovie(id);
          } catch (err) {
            console.error(`Failed to fetch movie ${id}:`, err);
            return null;
          }
        })
      );
      results.push(...batchResults.filter((movie) => movie !== null));
    }
    return results;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view profile');
          return;
        }

        // Fetch user profile and favorites concurrently
        const [userRes, favRes] = await Promise.all([
          api.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/user/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Set user profile
        setUser(userRes.data);
        setFormData({ username: userRes.data.username, email: userRes.data.email });

        // Fetch movie details for favorites
        const favMovies = await batchFetchMovies(favRes.data);
        setFavorites(favMovies);

        // Fetch watchlists
        await fetchWatchlists();

        // Fetch movie details for watchlists
        const watchlistMoviesData = {};
        for (const wl of watchlists) {
          if (wl.movies.length > 0) {
            watchlistMoviesData[wl.name] = await batchFetchMovies(wl.movies);
          } else {
            watchlistMoviesData[wl.name] = [];
          }
        }
        setWatchlistMovies(watchlistMoviesData);

        setError('');
      } catch (err) {
        setError(err.response?.data.message || 'Failed to fetch user data. Please log in.');
        toast.error(err.response?.data.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [fetchWatchlists]); // Removed watchlists from dependencies

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to update profile');
        return;
      }
      const res = await api.put(
        '/user/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to update profile');
    }
  };

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    const success = await createWatchlist(newWatchlist);
    if (success) {
      setNewWatchlist('');
      // Refetch watchlists to update UI
      await fetchWatchlists();
      // Update watchlist movies for new watchlist
      setWatchlistMovies((prev) => ({ ...prev, [newWatchlist]: [] }));
    }
  };

  const handleDeleteWatchlist = async (watchlistName) => {
    if (window.confirm(`Are you sure you want to delete "${watchlistName}"?`)) {
      await deleteWatchlist(watchlistName);
      setWatchlistMovies((prev) => {
        const newData = { ...prev };
        delete newData[watchlistName];
        return newData;
      });
    }
  };

  // Skeleton UI for loading state
  const skeletonUI = (
    <div className="container mx-auto p-6">
      <div className="h-10 bg-gray-700 rounded w-1/4 mb-6 animate-pulse" />
      <div className="flex border-b border-gray-700 mb-6">
        <div className="h-8 bg-gray-700 rounded w-20 mr-4 animate-pulse" />
        <div className="h-8 bg-gray-700 rounded w-20 mr-4 animate-pulse" />
        <div className="h-8 bg-gray-700 rounded w-20 animate-pulse" />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-700 rounded animate-pulse" />
          <div className="h-10 bg-gray-700 rounded animate-pulse" />
          <div className="h-10 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Memoize watchlist rendering
  const watchlistContent = useMemo(
    () => (
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Watchlists</h2>
        <form onSubmit={handleCreateWatchlist} className="mb-6 max-w-md">
          <div className="flex gap-4">
            <input
              type="text"
              value={newWatchlist}
              onChange={(e) => setNewWatchlist(e.target.value)}
              placeholder="Watchlist name"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Watchlist name"
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
            >
              Create
            </button>
          </div>
        </form>
        {watchlists.length === 0 ? (
          <p className="text-gray-400">No watchlists created yet</p>
        ) : (
          watchlists.map((wl) => (
            <div key={wl.name} className="mb-6">
              <div className="flex justify-between items-center">
                {/* <h3 className="text-xl font-semibold text-white">{wl.name}</h3> */}
                <h3
  className="text-xl font-semibold text-white"
  dangerouslySetInnerHTML={{ __html: wl.name }}
/>

                <button
                  onClick={() => handleDeleteWatchlist(wl.name)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Watchlist
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {wl.movies.length === 0 ? (
                  <p className="text-gray-400">No movies in this watchlist</p>
                ) : (
                  (watchlistMovies[wl.name] || []).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    ),
    [watchlists, watchlistMovies, newWatchlist]
  );

  if (loading) return skeletonUI;
  if (error) return <p className="text-red-500 text-center p-6">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Your Profile</h1>
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'profile' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'favorites' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'watchlists' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('watchlists')}
        >
          Watchlists
        </button>
      </div>

      {activeTab === 'profile' && user && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-300">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Username"
              />
            </div>
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.length === 0 ? (
              <p className="text-gray-400">No favorites yet</p>
            ) : (
              favorites.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            )}
          </div>
        </div>
      )}

      {activeTab === 'watchlists' && watchlistContent}
    </div>
  );
}

export default Profile;