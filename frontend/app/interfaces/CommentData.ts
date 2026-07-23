import { UserData } from './UserData';

export interface CommentData {
  id: number;
  text: string;
  prototypeId: number;
  userId: number;
  userName?: string;
  user?: UserData;
}

export interface CreateCommentParams {
  text: string;
}