import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PrototypeForm from '@/app/components/PrototypeForm';
import styles from '@/app/components/PrototypeForm.module.css';

// サーバー側でログインユーザー情報を取得する関数（プロジェクトの認証ロジックに合わせて書き換えてください）
async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('JSESSIONID')?.value; // 例: Spring BootのJSESSIONID等

  // セッションCookieがない場合は未ログインと判定
  if (!sessionToken) {
    return null;
  }

  // 必要に応じてバックエンドの認証状態確認APIを呼ぶか、クッキーの存在だけで判定
  return sessionToken;
}

const CreatePrototypePage = async () => {
  // 1. サーバー側でセッション確認
  const user = await getSessionUser();

  // 2. 未ログインの場合、ページを描画する前にトップページへリダイレクト！
  if (!user) {
    redirect('/');
  }

  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>新規プロトタイプ投稿</h2>
      <PrototypeForm />
    </div>
  );
};

export default CreatePrototypePage;