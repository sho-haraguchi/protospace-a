import { apiClient } from './client';

// 単一作品のお気に入り状態を取得
export const getBookmarkStatus = async (prototypeId: number): Promise<{ isBookmarked: boolean }> => {
  const response = await apiClient.get(`/prototypes/${prototypeId}/bookmarks/status`);
  return response.data;
};

// お気に入り追加をリクエスト
export const addBookmark = async (prototypeId: number): Promise<void> => {
  await apiClient.post(`/prototypes/${prototypeId}/bookmarks`);
};

// お気に入り解除をリクエスト
export const removeBookmark = async (prototypeId: number): Promise<void> => {
  await apiClient.delete(`/prototypes/${prototypeId}/bookmarks`);
};