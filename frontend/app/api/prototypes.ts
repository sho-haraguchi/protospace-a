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

/**
 * プロトタイプ一覧を取得する (ソート条件対応)
 * @param sort 'created' (投稿新着順) または 'updated' (更新新着順)
 */
export const findAllPrototypes = async (sort: string = 'created'): Promise<PrototypeData[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    // mainブランチの baseUrl 制御を活かしつつ、並び替え用の ?sort=${sort} パラメータを追加
    const response = await axios.get<PrototypeData[]>(`${baseUrl}/prototypes?sort=${sort}`, {
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