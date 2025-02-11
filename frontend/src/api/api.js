// File: src/api/api.js
import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Using Vite's environment variable syntax
  timeout: 10000, // 10-second timeout
});

// Optional: Add an interceptor for global error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default api;
