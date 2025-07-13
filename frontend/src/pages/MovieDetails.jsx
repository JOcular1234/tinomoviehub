// src/pages/MovieDetails.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.rating || !review.text) {
      alert('Please provide both a rating and review text');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/user/reviews',
        { movieId: id, ...review },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Review submitted successfully!');
      setReview({ rating: '', text: '' });
    } catch (err) {
      alert('Failed to submit review. Please log in.');
    }
  };

  if (loading) return (
    <div className="text-center p-6">
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
  );
  if (error) return <p className="text-red-500 text-center p-6">{error}</p>;
  if (!movie) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path || '/placeholder.jpg'}`}
            alt={movie.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            <p className="text-gray-300">{movie.release_date?.split('-')[0]}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path || '/placeholder.jpg'}`}
              alt={movie.title}
              className="w-full md:w-1/4 rounded-lg shadow"
            />
            <div className="flex-1">
              <p className="text-gray-300 mb-4">{movie.overview}</p>
              <p className="text-gray-400">Release Date: {movie.release_date}</p>
              <p className="text-gray-400">Rating: {movie.vote_average}/10</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Add a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-300">Rating (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Rating"
                />
              </div>
              <div>
                <label className="block text-gray-300">Review</label>
                <textarea
                  value={review.text}
                  onChange={(e) => setReview({ ...review, text: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  aria-label="Review text"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;