import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

/**
 * サーバー側でセッションCookieを検証し、ログイン状態か判定する
 */
export async function checkServerSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('JSESSIONID')?.value;

    if (!sessionToken) {
      return false;
    }

    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        'Cache-Control': 'no-cache',
        Cookie: `JSESSIONID=${sessionToken}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
}