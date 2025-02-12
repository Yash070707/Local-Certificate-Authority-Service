import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: API_TIMEOUT,
});

export const login = async (credentials, role) => {
  const response = await authApi.post('/signin', {
    ...credentials,
    role
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await authApi.post('/signup', userData);
  return response.data;
};