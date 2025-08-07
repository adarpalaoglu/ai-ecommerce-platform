import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000', // Default to localhost:8000 if not set
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
