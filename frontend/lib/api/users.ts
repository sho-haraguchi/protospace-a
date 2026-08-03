import { cookies } from 'next/headers';
import axios from 'axios';
import { UserData } from '@/app/interfaces/UserData';
import { apiClient } from './client';

export async function getCurrentUserServer(): Promise<UserData | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
    const response = await axios.get<UserData>(`${baseURL}/users/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    return null;
  }
}

  /**
   * ユーザーアカウント削除API
   */
  export async function deleteUser() {
    const response = await apiClient.delete<{ message: string }>('/users');
    return response.data;
  }
