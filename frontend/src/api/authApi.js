import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: API_TIMEOUT,
});

// Login function
export const login = async (credentials) => {
  const response = await authApi.post('/signin', credentials);
  return response.data;
};

// Register function
export const register = async (credentials) => {
  const response = await authApi.post('/signup', credentials);
  return response.data;
};