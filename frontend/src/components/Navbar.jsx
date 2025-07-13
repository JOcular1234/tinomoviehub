// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigate('/')}
        >
          TinoMovie
        </h1>
        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white transition"
          >
            Home
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-300 hover:text-white transition"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-gray-300 hover:text-white transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <button
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="block w-full text-left text-gray-300 hover:text-white p-2"
          >
            Home
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white p-2"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-red-500 p-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white p-2"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-white p-2"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;