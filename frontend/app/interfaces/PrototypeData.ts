import { UserData } from './UserData';

export interface PrototypeData {
  id: number;
  name: string;
  slogan: string;
  image: string;
  concept: string;
  user: UserData;
  // バックエンドから返却されるタイムスタンプを追加
  createdAt?: string; // 作成日時
  updatedAt?: string; // 更新日時
}