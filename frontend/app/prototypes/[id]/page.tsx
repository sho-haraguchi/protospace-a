import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getPrototypeDetail } from '@/lib/api/prototypes';
import { getComments } from '@/lib/api/comments';
import CommentSection from '@/app/components/CommentSection';

const IMAGE_BASE_URL = 'http://localhost:8080/api/images';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PrototypeDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [prototype, initialComments] = await Promise.all([
    getPrototypeDetail(id),
    getComments(Number(id)).catch(() => []),
  ]);

  if (!prototype) {
    notFound();
  }

  const imageUrl = prototype.image
    ? prototype.image.startsWith('http')
      ? prototype.image
      : `${IMAGE_BASE_URL}/${prototype.image}`
    : 'https://placehold.co/600x400?text=No+Image';

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
          src={imageUrl}
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

      {/* コメント機能 */}
      <CommentSection
        prototypeId={Number(id)}
        initialComments={initialComments}
      />
    </div>
  );
}