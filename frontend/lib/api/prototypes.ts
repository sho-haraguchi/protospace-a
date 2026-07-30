import axios from 'axios';
import { apiClient } from './client';
import { PrototypeData } from '@/app/interfaces/PrototypeData';

// --- 環境に応じた API のベースURLを取得する処理 ---
const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    // サーバー側 (SSR/Server Component) で実行される場合
    return process.env.INTERNAL_API_BASE_URL || 'http://localhost:8080/api';
  }
  // ブラウザ側 (Client Component) で実行される場合
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

// --- プロトタイプ一覧を取得する関数 ---
export const findAllPrototypes = async (sort: string = 'created'): Promise<PrototypeData[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await axios.get<PrototypeData[]>(`${baseUrl}/prototypes?sort=${sort}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error('API request failed');
    }
    throw error;
  }
};

// プロトタイプ詳細取得
export async function getPrototypeDetail(id: string): Promise<PrototypeData | null> {
  try {
    const response = await apiClient.get<PrototypeData>(`/prototypes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID:${id} のプロトタイプ取得に失敗しました:`, error);
    return null;
  }
}

// プロトタイプ編集・更新
export async function updatePrototype(id: string, formData: FormData) {
  const response = await apiClient.put(`/prototypes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * プロトタイプ削除
 */
export async function deletePrototype(id: number | string): Promise<void> {
  await apiClient.post(`/prototypes/${id}/delete`);
}