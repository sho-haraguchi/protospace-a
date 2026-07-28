import axios from 'axios';
import { cookies } from 'next/headers';

const SERVER_API_BASE_URL = 
  process.env.INTERNAL_API_BASE_URL || 
  'http://localhost:8080/api';

export async function checkServerSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('JSESSIONID')?.value;

    if (!sessionToken) {
      return false;
    }

    const response = await axios.get(`${SERVER_API_BASE_URL}/users/me`, {
      headers: {
        'Cache-Control': 'no-cache',
        Cookie: `JSESSIONID=${sessionToken}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error('checkServerSession error:', error);
    return false;
  }
}