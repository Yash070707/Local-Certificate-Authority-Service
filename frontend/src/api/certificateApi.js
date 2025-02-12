import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const certificateApi = axios.create({
  baseURL: `${API_BASE_URL}/certificate`,
  timeout: API_TIMEOUT,
});

export const submitCSR = async (csrData, token) => {
  const response = await certificateApi.post('/generate-csr', csrData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};