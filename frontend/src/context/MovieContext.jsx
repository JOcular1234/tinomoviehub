import { createContext, useState } from 'react';
import axios from 'axios';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movieCache, setMovieCache] = useState({});

  const getMovie = async (id) => {
    if (movieCache[id]) {
      return movieCache[id];
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
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