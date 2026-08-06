import axios from 'axios';

export const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.baseURL = '/api';
  } else {
  const rawUrl =
    process.env.INTERNAL_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8080/api';

  const baseUrl = rawUrl.replace(/\/$/, '');
  config.baseURL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  }
  
  return config;
});