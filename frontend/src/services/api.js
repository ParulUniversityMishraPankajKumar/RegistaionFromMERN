import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/employees',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle API responses
api.interceptors.response.use(
  (response) => {
    // Return the data object directly if it exists
    return response.data?.data || response.data;
  },
  (error) => {
    // Handle errors
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;