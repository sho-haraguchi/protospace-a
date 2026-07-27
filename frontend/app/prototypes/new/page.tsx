import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css';

async function checkAuthOnServer() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('JSESSIONID')?.value;

  // JSESSIONID ヘッダーを付けてバックエンドへ直接問い合わせる場合
  try {
    const res = await fetch('http://localhost:8080/api/users/me', {
      headers: {
        Cookie: sessionCookie ? `JSESSIONID=${sessionCookie}` : '',
      },
      // SSR時にキャッシュさせない
      cache: 'no-store',
    });

    return res.ok;
  } catch (error) {
    return false;
  }
}

const CreatePrototypePage = async () => {
  // サーバー側で認証チェック
  const isAuthenticated = await checkAuthOnServer();

  // 未ログインの場合は画面を描画せずに即座にログインページ（またはトップ）へリダイレクト
  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>新規プロトタイプ投稿</h2>
      <PrototypeForm />
    </div>
  );
};

export default CreatePrototypePage;