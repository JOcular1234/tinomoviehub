// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-500 transition">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/watchlists" className="hover:text-blue-500 transition">
                  Watchlists
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-500 transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@yourmovieapp.com"
                  className="flex items-center hover:text-blue-500 transition"
                >
                  <FaEnvelope className="mr-2" />
                  support@yourmovieapp.com
                </a>
              </li>
              <li>
                <Link to="/support" className="hover:text-blue-500 transition">
                  Get Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/yourmovieapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com/yourmovieapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://github.com/yourmovieapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            &copy; {currentYear} TinoMovie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;