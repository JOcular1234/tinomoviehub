// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WatchlistProvider } from './context/WatchlistContext';
import Footer from './components/Footer';
import { MovieProvider } from './context/MovieContext';


function App() {
  return (
          <MovieProvider>

        <WatchlistProvider>

    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />


      </div>
    </Router>
        </WatchlistProvider>
      </MovieProvider>

  );
}

export default App;