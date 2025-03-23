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

export const generateCSR = async (formData) => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    const username = localStorage.getItem('username'); // Get username

    if (!token || !username) {
      throw new Error('No token or username found');
    }

    const response = await certificateApi.post('/generate-csr', 
      { ...formData, username }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating CSR:', error.response ? error.response.data : error.message);
    return { success: false, message: 'CSR generation failed' };
  }
};


export const downloadFile = async (fileName) => {
  try {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    if (!token) {
      throw new Error('No token found');
    }
    const response = await certificateApi.get(`/download/${fileName}`, {
      responseType: 'blob', // Important for file downloads
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading file:', error.response ? error.response.data : error.message);
  }
};

