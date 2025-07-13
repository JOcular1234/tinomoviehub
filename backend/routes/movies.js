// backend/routes/movies.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Search movies
router.get('/search', async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// Filter movies
router.get('/discover', async (req, res) => {
  const { genre, year, rating, page = 1 } = req.query;
  let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`;

  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;
  if (rating) url += `&vote_average.gte=${rating}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${req.params.id}?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching movie details' });
  }
});

module.exports = router;