import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Use environment variable for API URL, fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tinomoviehub.onrender.com/api';

// Debug: Log the API URL being used
// console.log('API Base URL:', API_BASE_URL);
// console.log('Environment variable:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;