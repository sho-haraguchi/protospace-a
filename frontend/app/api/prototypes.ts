import axios from 'axios';
import { PrototypeData } from '../interfaces/PrototypeData';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, 
});

export const findAllPrototypes = async (): Promise<PrototypeData[]> => {
  try {
    const response = await api.get<PrototypeData[]>('/prototypes');
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error('APIの取得に失敗しました');
    }
    throw error;
  }
};