import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiCall = async (endpoint) => {
  const startTime = performance.now();
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    const endTime = performance.now();
    return { data: response.data, time: endTime - startTime, error: null };
  } catch (error) {
    const endTime = performance.now();
    return { data: null, time: endTime - startTime, error: error.message || 'Error occurred' };
  }
};
