import { createContext, useState } from 'react';
import api from '../api';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movieCache, setMovieCache] = useState({});

  const getMovie = async (id) => {
    if (movieCache[id]) {
      return movieCache[id];
    }
    try {
      const res = await api.get(`/movies/${id}`);
      setMovieCache((prev) => ({ ...prev, [id]: res.data }));
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch movie ${id}:`, err);
      throw err;
    }
  };

  return (
    <MovieContext.Provider value={{ getMovie, movieCache }}>
      {children}
    </MovieContext.Provider>
  );
};