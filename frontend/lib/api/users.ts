import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { UserData } from '@/app/interfaces/UserData';

// ユーザー新規登録のパラメータ型
export interface SignupParams {
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  profile: string;
  affiliation: string;
  position: string;
  image?: File | string;
}

// ログインリクエスト用のパラメータ型
export interface LoginParams {
  email: string;
  password: string;
}

// ユーザー情報の型（UserData と同等）
export type User = UserData;

// プロトタイプ情報の型
export interface Prototype {
  id: number;
  name: string;
  slogan: string;
  concept: string;
  image: string;
}

// ユーザー詳細の型
export interface UserDetailResponse {
  user: User;
  prototypes: Prototype[];
}

// ユーザー更新用の型
export interface UpdateUserParams {
  name?: string;
  profile?: string;
  affiliation?: string;
  position?: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
  image?: File | string;
}

/**
 * ユーザー新規登録処理
 */
export async function signupUser(params: SignupParams | FormData) {
  // FormData（画像あり）の場合は専用のヘッダーを指定する
  const isFormData = params instanceof FormData;
  const response = await apiClient.post('/users', params, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response;
}

/**
 * ログイン処理APIを実行する関数
 */
export async function loginUser(params: LoginParams) {
  const response = await apiClient.post('/users/login', params);
  return response;
}

/**
 * ユーザー詳細情報・投稿プロトタイプ一覧取得API関数
 */
export async function getUserDetail(id: string): Promise<UserDetailResponse | null> {
  if (!id || id === 'undefined') {
    return null;
  }

  try {
    const res = await apiClient.get<UserDetailResponse>(`/users/${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('API Response Error:', error.response?.data);
    }
    console.error('getUserDetail Error:', error);
    return null;
  }
}

/**
 * ログイン中のユーザー情報取得API関数（クライアントコンポーネント用）
 */
export async function getMe(): Promise<UserData | null> {
  const response = await apiClient.get<UserData>('/users/me');
  return response.data;
}

/**
 * ユーザー情報更新API関数
 */
export async function updateUser(params: UpdateUserParams | FormData) {
  const response = await apiClient.post('/users/update', params);
  
  return response;
}

/**
 * ユーザーアカウント削除API
 */
export async function deleteUser() {
  const response = await apiClient.delete<{ message: string }>('/users');
  return response.data;
}
