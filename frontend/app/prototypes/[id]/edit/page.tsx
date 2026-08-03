import { notFound, redirect } from 'next/navigation';
import { getPrototypeDetail } from '@/lib/api/prototypes';
import { getCurrentUserServer } from '@/lib/api/users.server';
import PrototypeEditForm from './PrototypeEditForm';
import styles from '@/app/components/PrototypeForm.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

// サーバーコンポーネントとして実装
export default async function EditPrototypePage({ params }: PageProps) {
  const { id } = await params;

  // サーバー側で「投稿詳細」と「現在のログインユーザー」を並列取得
  const [prototype, currentUser] = await Promise.all([
    getPrototypeDetail(id),
    getCurrentUserServer(),
  ]);

  // 投稿が存在しない場合は 404 ページを表示
  if (!prototype) {
    notFound();
  }

  // 権限チェック：未ログイン、または投稿者本人でない場合はトップページへ強制遷移
  const ownerId = prototype.user?.id;
  if (!currentUser || String(currentUser.id) !== String(ownerId)) {
    redirect('/');
  }

  // クライアントコンポーネントに渡す初期データを構成
  const initialData = {
    name: prototype.name,
    slogan: prototype.slogan,
    concept: prototype.concept,
    image: prototype.image,
  };

  return (
    <div className={styles.container}>
      <h2 className={styles['page-heading']}>プロトタイプ編集</h2>
      {/* データの取得と検証が完了した初期データをクライアントコンポーネントへ渡す */}
      <PrototypeEditForm id={id} initialData={initialData} />
    </div>
  );
}