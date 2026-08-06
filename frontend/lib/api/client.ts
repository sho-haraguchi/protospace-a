import axios from 'axios';

export const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // ブラウザ側・サーバー側問わず、直接バックエンド(8080)を向くように統一
  const rawUrl =
    process.env.INTERNAL_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8080/api';

  const baseUrl = rawUrl.replace(/\/$/, '');
  config.baseURL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  
  return config;
});