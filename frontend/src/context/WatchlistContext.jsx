// src/context/WatchlistContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWatchlists = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view watchlists');
        return;
      }
      const res = await axios.get('http://localhost:5000/api/user/watchlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlists(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data.message || 'Failed to fetch watchlists');
      toast.error(err.response?.data.message || 'Failed to fetch watchlists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  const createWatchlist = async (name) => {
    if (!name.trim()) {
      toast.error('Watchlist name is required');
      return false;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create a watchlist');
        return false;
      }
      const res = await axios.post(
        'http://localhost:5000/api/user/watchlists',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlists(res.data);
      toast.success(`Watchlist "${name}" created!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to create watchlist');
      return false;
    }
  };

  const addToWatchlist = async (watchlistName, movieId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to add to watchlist');
        return false;
      }
      const res = await axios.post(
        `http://localhost:5000/api/user/watchlists/${watchlistName}`,
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlists(res.data);
      toast.success(`Added to ${watchlistName}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to add to watchlist');
      return false;
    }
  };

  const removeFromWatchlist = async (watchlistName, movieId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to remove from watchlist');
        return false;
      }
      const res = await axios.delete(
        `http://localhost:5000/api/user/watchlists/${watchlistName}/${movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlists(res.data);
      toast.success(`Removed from ${watchlistName}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to remove from watchlist');
      return false;
    }
  };

  const deleteWatchlist = async (watchlistName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to delete watchlist');
        return false;
      }
      const res = await axios.delete(
        `http://localhost:5000/api/user/watchlists/${watchlistName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchlists(res.data);
      toast.success(`Watchlist "${watchlistName}" deleted!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data.message || 'Failed to delete watchlist');
      return false;
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        loading,
        error,
        fetchWatchlists,
        createWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        deleteWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};