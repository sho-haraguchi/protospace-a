import { apiClient } from './client';
import { CommentData, CreateCommentParams } from '@/app/interfaces/CommentData';

export const getComments = async (prototypeId: number): Promise<CommentData[]> => {
  const response = await apiClient.get<CommentData[]>(`/prototypes/${prototypeId}/comments`);
  return response.data;
};


export const createComment = async (
  prototypeId: number,
  params: CreateCommentParams
): Promise<CommentData> => {
  const response = await apiClient.post<CommentData>(
    `/prototypes/${prototypeId}/comments`,
    params
  );
  return response.data;
};