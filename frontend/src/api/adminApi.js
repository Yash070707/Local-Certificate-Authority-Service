import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  timeout: API_TIMEOUT,
});

export const getPendingCSRs = async (token) => {
  const response = await adminApi.get('/csrs', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const manageCertificate = async (action, certId, token) => {
  const response = await adminApi.post(`/${action}/${certId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};