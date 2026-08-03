import { PrototypeData } from '@/app/interfaces/PrototypeData';
import { cookies } from 'next/headers';
import axios from 'axios';

// マイコレクション一覧を取得（認証用のCookieを付与）
export async function getMyBookmarksServer(): Promise<PrototypeData[]> {
  try {
    // 受信したリクエストからCookieを抽出し、ブラウザの代わりにバックエンドAPIを呼び出す
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const baseURL = process.env.INTERNAL_API_BASE_URL || 'http://localhost:8080/api';

    const response = await axios.get<PrototypeData[]>(`${baseURL}/bookmarks/my-list`, {
      headers: {  Cookie: cookieHeader  },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookmarks on server', error);
    // エラー発生時は空配列を返し、画面が真っ白になるのを防ぐ
    return []; 
  }
}