import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: API_TIMEOUT,
});

// Login function
export const login = async ({ username, password }) => {
  const response = await authApi.post('http://localhost:5000/api/auth/signin', { username, password });
  console.log(response.data);
  return response.data;
};

// Sign-up function
export const register = async ({ username, password }) => {
  const response = await authApi.post('http://localhost:5000/api/auth/signup', { username, password },  {
    withCredentials: true
  });
  console.log(response.data);
  return response.data;
};