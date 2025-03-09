import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: API_TIMEOUT,
});

// Login function
export const login = async ({ username, password }) => {
  const response = await authApi.post('http://localhost:5000/api/auth/signin', { username, password });
  return response.data;
};

// Sign-up function
export const register = async ({ username, email, password }) => {
  const response = await authApi.post('http://localhost:5000/api/auth/signup', { username, email, password }, { withCredentials: true });
  return response.data;
};

// OTP verification function
export const verifyOtp = async ({ email, otp }) => {
  const response = await authApi.post('http://localhost:5000/api/auth/verify-email', { email, otp });
  return response.data;
};

// Forgot password function
export const forgotPassword = async ({ email }) => {
  const response = await authApi.post('http://localhost:5000/api/auth/forgot-password', { email });
  return response.data;
};