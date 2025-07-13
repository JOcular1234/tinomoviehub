// backend/routes/users.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, email: user.email, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add favorite movie
router.post('/favorites', auth, async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ message: 'Movie ID is required' });
  }
  try {
    const user = await User.findById(req.user);
    const movieIdNum = Number(movieId);
    if (!user.favorites.includes(movieIdNum)) {
      user.favorites.push(movieIdNum);
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get watchlists
router.get('/watchlists', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.watchlists || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create watchlist
router.post('/watchlists', auth, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Watchlist name is required' });
  }
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.watchlists.some((wl) => wl.name === name)) {
      return res.status(400).json({ message: 'Watchlist name already exists' });
    }
    user.watchlists.push({ name, movies: [] });
    await user.save();
    res.json(user.watchlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to watchlist
router.post('/watchlists/:name', auth, async (req, res) => {
  const { name } = req.params;
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ message: 'Movie ID is required' });
  }
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const watchlist = user.watchlists.find((wl) => wl.name === name);
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    const movieIdNum = Number(movieId);
    if (!watchlist.movies.includes(movieIdNum)) {
      watchlist.movies.push(movieIdNum);
      await user.save();
    }
    res.json(user.watchlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from watchlist
router.delete('/watchlists/:name/:movieId', auth, async (req, res) => {
  const { name, movieId } = req.params;
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const watchlist = user.watchlists.find((wl) => wl.name === name);
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    watchlist.movies = watchlist.movies.filter((id) => id !== Number(movieId));
    await user.save();
    res.json(user.watchlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete watchlist
router.delete('/watchlists/:name', auth, async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.watchlists = user.watchlists.filter((wl) => wl.name !== name);
    await user.save();
    res.json(user.watchlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/reviews', auth, async (req, res) => {
  const { movieId, rating, text } = req.body;
  if (!movieId || !rating || !text) {
    return res.status(400).json({ message: 'Movie ID, rating, and text are required' });
  }
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.reviews.push({ movieId: Number(movieId), rating: Number(rating), text });
    await user.save();
    res.json(user.reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  const { username, email } = req.body;
  if (!username && !email) {
    return res.status(400).json({ message: 'Username or email is required' });
  }
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.json({ id: user._id, email: user.email, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;