import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getPrototypeDetail } from '@/lib/api/prototypes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PrototypeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const prototype = await getPrototypeDetail(id);

  if (!prototype) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* タイトル */}
      <h1 className={styles.title}>{prototype.name}</h1>

      {/* 投稿者 */}
      <p className={styles.author}>
        <Link href={`/users/${prototype.user?.id}`} className={styles.authorLink}>
          by {prototype.user?.name || '名無し'}
        </Link>
      </p>

      {/* 編集・削除ボタン */}
      <div className={styles.buttonGroup}>
        <Link href={`/prototypes/${prototype.id}/edit`} className={styles.btn}>
          編集する
        </Link>
        <button className={styles.btn}>削除する</button>
      </div>

      {/* 画像 */}
      <div className={styles.imageWrapper}>
        <img
          src={prototype.image || 'https://placehold.co/600x400?text=No+Image'}
          alt={prototype.name}
          className={styles.image}
        />
      </div>

      {/* キャッチコピー */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>キャッチコピー</h2>
        <p className={styles.sectionText}>{prototype.slogan}</p>
      </div>

      {/* コンセプト */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>コンセプト</h2>
        <p className={styles.sectionText}>{prototype.concept}</p>
      </div>
    </div>
  );
}