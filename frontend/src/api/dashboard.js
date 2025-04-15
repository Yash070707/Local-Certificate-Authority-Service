import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./apiConfig";

const dashboardApi = axios.create({
    baseURL: `${API_BASE_URL}/dashboard`, // Ensure consistent API path
    timeout: API_TIMEOUT,
});

export const fetchCertificates = async (username) => {
    try {
        const response = await dashboardApi.get('/api/dashboard', { params: { username } });
        if (response.data.success) {
            console.log('Certificates:', response.data.certificates);
            return response.data.certificates;
        } else {
            console.error('Error fetching certificates:', response.data.error);
        }
    } catch (error) {
        console.error('API Error:', error);
    }
};