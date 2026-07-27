import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { PrototypeData } from '../interfaces/PrototypeData';

export const findAllPrototypes = async (): Promise<PrototypeData[]> => {
  try {
    const response = await apiClient.get<PrototypeData[]>('/prototypes');
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error('APIの取得に失敗しました');
    }
    throw error;
  }
};