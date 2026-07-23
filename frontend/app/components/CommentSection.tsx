'use client';

import { FormEvent } from 'react';
import Link from 'next/link';
import { CommentData } from '@/app/interfaces/CommentData';
import { useAuth } from '@/app/context/AuthContext';
import { useComments } from '@/app/hooks/useComments';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  prototypeId: number;
  initialComments?: CommentData[];
}

export default function CommentSection({
  prototypeId,
  initialComments = [],
}: CommentSectionProps) {
  const { currentUser, loading } = useAuth();

  const { comments, text, setText, submitComment, isSubmitting } = useComments(
    prototypeId,
    initialComments,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>コメント</h3>

      {/* ログイン時のみ送信フォームを表示 */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.input}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting || !text.trim()}
          >
            {isSubmitting ? '送信中...' : '送信する'}
          </button>
        </form>
      ) : (
        !loading && (
          <p className={styles.loginNotice}>
            コメントを投稿するには{' '}
            <Link href="/login" className={styles.loginLink}>
              ログイン
            </Link>{' '}
            が必要です。
          </p>
        )
      )}

      {/* コメント一覧表示 */}
      {comments.length > 0 && (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              {comment.text}
              <Link
                href={`/users/${comment.userId}`}
                className={styles.authorLink}
              >
                ({comment.userName || comment.user?.name || '名無し'})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}