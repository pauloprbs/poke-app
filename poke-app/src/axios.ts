import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Substitua pela sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;