import { apiClient } from './client';
import { PrototypeData } from '@/app/interfaces/PrototypeData';

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

/**
 * プロトタイプ検索
 */
export async function searchPrototypes(query: string): Promise<PrototypeData[]> {
  try {
    const response = await apiClient.get<PrototypeData[]>('/search', {
      params: { query }, 
    });
    return response.data;
  } catch (error) {
    console.error('プロトタイプの検索に失敗しました:', error);
    return []; 
  }
}