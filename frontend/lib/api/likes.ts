import { apiClient } from './client';

export interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
}

export const getLikeStatus = async (prototypeId: number): Promise<LikeStatus> => {
  const response = await apiClient.get<LikeStatus>(`/prototypes/${prototypeId}/likes`);
  return response.data;
};

export const addLike = async (prototypeId: number): Promise<void> => {
  await apiClient.post(`/prototypes/${prototypeId}/likes`);
};

export const removeLike = async (prototypeId: number): Promise<void> => {
  await apiClient.delete(`/prototypes/${prototypeId}/likes`);
};