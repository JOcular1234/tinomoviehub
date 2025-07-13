const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  favorites: [{ type: Number }], // TMDB movie IDs
  watchlists: {
    type: [
      {
        name: { type: String, required: true },
        movies: { type: [Number], default: [] }, // TMDB movie IDs
      },
    ],
    default: [],
  },
  reviews: [
    {
      movieId: Number,
      rating: Number,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);