import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { PrototypeData } from '../interfaces/PrototypeData';

/**
 * プロトタイプ一覧を取得する (ソート条件対応)
 * @param sort 'created' (投稿新着順) または 'updated' (更新新着順)
 */
export const findAllPrototypes = async (sort: string = 'created'): Promise<PrototypeData[]> => {
  try {
    const response = await apiClient.get<PrototypeData[]>(`/prototypes?sort=${sort}`);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error('APIの取得に失敗しました');
    }
    throw error;
  }
};