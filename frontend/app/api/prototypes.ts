import axios from 'axios';
import { PrototypeData } from '../interfaces/PrototypeData';

/**
 * 実行環境に応じて適切な API ベース URL を取得
 */
const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    // サーバーサイド実行時はフルURLを使用
    return process.env.INTERNAL_API_BASE_URL || 'http://localhost:8080/api';
  }
  // クライアントサイド実行時はプロキシ用の相対パスを使用
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

export const findAllPrototypes = async (): Promise<PrototypeData[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await axios.get<PrototypeData[]>(`${baseUrl}/prototypes`, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error('APIの取得に失敗しました');
    }
    throw error;
  }
};