import { apiClient } from './client';
import { Prototype } from '@/app/interfaces/prototype';

// プロトタイプ詳細取得
export async function getPrototypeDetail(id: string): Promise<Prototype | null> {
  try {
    const response = await apiClient.get<Prototype>(`/prototypes/${id}`);
    return response.data; // axios は .data の中に変換済みJSONが入っています
  } catch (error) {
    console.error(`ID:${id} のプロトタイプ取得に失敗しました:`, error);
    return null;
  }
}